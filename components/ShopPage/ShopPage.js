import {
  Grid,
  Typography,
  TextField,
  Collapse,
  List,
  IconButton,
  Divider,
  useMediaQuery,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Box,
  Slider,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import classes from "./ShopPage.module.css";
import { useEffect, useState } from "react";
import {
  ExpandMore,
  ExpandLess,
  Search as SearchIcon,
  Close,
} from "@material-ui/icons";
import Filter from "./Filter";
import Product from "../Product";
import SortMenu from "./SortMenu";
import { useHttpClient } from "../../hooks/http-hook";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { SET_SNACKBAR } from "../../redux/snackbar";

const values = [
  { value: "all", label: "Sort" },
  { value: "bestSeller", label: "Best Seller" },
  { value: "newestAdded", label: "Newest Added" },
  { value: "htl", label: "Price: High to Low" },
  { value: "lth", label: "Price: Low to High" },
];

const filters = [{ value: "category", label: "Category" }];

const ShopPage = ({ data, categories }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { sendRequest } = useHttpClient();
  const { token, user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.up("md"));
  const [filterOpen, setFilterOpen] = useState(false);
  const [value, setValue] = useState(values[0]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [products, setProducts] = useState(data);
  const [limit, setLimit] = useState(7);
  const [skip, setSkip] = useState(7);
  const [search, setSearch] = useState("");
  const [showMore, setShowMore] = useState(true);
  const [filtersState, setFiltersState] = useState([
    {
      value: "collection",
      open: false,
    },
    {
      value: "color",
      open: false,
    },
    {
      value: "category",
      open: false,
    },
    {
      value: "range",
      open: false,
    },
  ]);
  const [categoryValue, setCategoryValue] = useState({
    _id: null,
    name: "Select Category",
  });
  const [sliderValue, setSliderValue] = useState([0, 10000]);

  const fetchData = async (limit, skip, search, sort, category, range) => {
    const resdata = await sendRequest({
      ignoreSnackbar: true,
      method: "GET",
      url: "/products",
      params: {
        limit,
        skip,
        search,
        sort,
        category,
        min: range[0],
        max: range[1],
      },
    });

    if (resdata.products.length === 0) {
      dispatch(
        SET_SNACKBAR({
          snackbarType: "info",
          snackbarMessage: `Couldn't find any products!`,
        })
      );
    }

    if (resdata.products.length < 8) {
      setShowMore(false);
    } else {
      setShowMore(true);
    }
    return resdata;
  };

  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: async (values) => {
      const resdata = await fetchData(
        limit,
        0,
        values.search,
        value.value,
        categoryValue._id,
        sliderValue
      );
      setSearch(values.search);
      setProducts(resdata.products);
    },
  });

  const handlerFilterClick = () => {
    setFilterOpen(!filterOpen);
  };

  useEffect(() => {
    if (matchesMd) {
      setFilterOpen(true);
    } else {
      setFilterOpen(false);
    }
  }, [matchesMd]);

  const filterValueClickHandler = (value) => {
    const filter = filtersState.find((i) => i.value === value);
    filter.open = !filter.open;
    setFiltersState((prev) => [...prev, filter]);
  };

  const handleClearFilters = () => {
    setCategoryValue({
      _id: "all",
      name: "Select Category",
    });

    setSliderValue([0, 10000]);
  };

  const handleSelect = (id, selected) => {
    if (selected) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const newIds = [];
      data.map((product) => newIds.push(product._id));
      setSelectedIds(newIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleDelete = async (ids) => {
    const resdata = await sendRequest({
      method: "DELETE",
      url: "/products",
      body: { ids },
      headers: { Authorization: `Bearer ${token}` },
    });
    setDialog(false);
    if (resdata) {
      router.reload();
    }
  };

  const handleLoadMore = async () => {
    const resdata = await fetchData(
      8,
      skip,
      search,
      value.value,
      categoryValue._id,
      sliderValue
    );
    setProducts((prev) => [...prev, ...resdata.products]);
    setSkip((prev) => prev + 8);
    setLimit((prev) => prev + 8);
  };

  useEffect(() => {
    (async () => {
      if (value.value !== "all") {
        const resdata = await fetchData(
          limit,
          0,
          search,
          value.value,
          categoryValue._id,
          sliderValue
        );
        setProducts(resdata.products);
      }
    })();
  }, [value]);

  useEffect(() => {
    (async () => {
      if (categoryValue._id !== null) {
        const resdata = await fetchData(
          limit,
          0,
          search,
          value.value,
          categoryValue._id,
          sliderValue
        );
        setProducts(resdata.products);
      }
    })();
  }, [categoryValue]);

  const valuetext = (value) => {
    return `$${value}`;
  };

  const handlerSliderChange = (e, newValue) => {
    setSliderValue(newValue);
  };

  const handleApplyRange = async () => {
    if (sliderValue[0] !== 0 || sliderValue[1] !== 10000) {
      const resdata = await fetchData(
        limit,
        0,
        search,
        value.value,
        categoryValue._id,
        sliderValue
      );
      setProducts(resdata.products);
    }
  };

  return (
    <>
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Selected products will be deleted permanently, are you sure about
            that ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDelete(selectedIds)} color="secondary">
            Delete
          </Button>
          <Button onClick={() => setDialog(false)} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {data.length > 0 ? (
        <Grid container className={classes.shopContainer}>
          {user?.role === "admin" && (
            <>
              <Checkbox onChange={(e) => handleSelectAll(e.target.checked)} />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setDialog(true)}
              >
                Delete Selected
              </Button>
            </>
          )}
          <Grid container spacing={4} alignItems="flex-end">
            {/* Search */}
            <Grid item xs={12} md={8}>
              <form onSubmit={formik.handleSubmit}>
                <Grid
                  container
                  alignItems="flex-end"
                  style={{ transform: "translateY(1px)" }}
                >
                  <Grid item>
                    <SearchIcon
                      fontSize="large"
                      style={{
                        transform: "translateY(6px)",
                        cursor: "pointer",
                      }}
                      onClick={formik.handleSubmit}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      label="Search"
                      name="search"
                      id="search"
                      value={formik.values.search}
                      onChange={formik.handleChange}
                      placeholder="enter product name"
                      fullWidth
                      margin="dense"
                    />
                  </Grid>
                </Grid>
              </form>
            </Grid>
            {/* Sort */}
            <Grid item xs={12} md={4}>
              <Grid container justifyContent="center">
                <SortMenu values={values} setValue={setValue} value={value} />
              </Grid>

              <Divider
                style={{ marginBottom: 3.6, backgroundColor: "black" }}
              />
            </Grid>
            {/* Filter and Products */}
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={3}>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <Typography
                        variant={matchesMd ? "body1" : "h6"}
                        color={matchesMd ? "textSecondary" : "primary"}
                      >
                        {matchesMd ? "FILTER BY" : "Filters"}
                      </Typography>
                    </Grid>
                    {!matchesMd && (
                      <Grid item>
                        <IconButton onClick={handlerFilterClick}>
                          {filterOpen ? (
                            <ExpandLess fontSize="large" />
                          ) : (
                            <ExpandMore fontSize="large" />
                          )}
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                  <Collapse in={filterOpen} timeout="auto" unmountOnExit>
                    <List
                      component="div"
                      disablePadding
                      style={{ padding: "0 12px" }}
                    >
                      {filters.map((item) => {
                        return (
                          <div key={item.value}>
                            <Grid
                              container
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Grid item>
                                <Typography variant="h6">
                                  {item.label}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <IconButton
                                  onClick={() =>
                                    filterValueClickHandler(item.value)
                                  }
                                >
                                  {filtersState.find(
                                    (s) => s.value === item.value
                                  ).open ? (
                                    <ExpandLess fontSize="large" />
                                  ) : (
                                    <ExpandMore fontSize="large" />
                                  )}
                                </IconButton>
                              </Grid>
                            </Grid>
                            <Collapse
                              in={
                                filtersState.find((i) => i.value === item.value)
                                  .open
                              }
                              timeout="auto"
                              unmountOnExit
                            >
                              <Filter
                                label={item.label}
                                value={item.value}
                                categories={categories}
                                categoryValue={categoryValue}
                                setCategoryValue={setCategoryValue}
                              />
                            </Collapse>
                          </div>
                        );
                      })}
                      <Grid container justifyContent="center">
                        <Grid item xs={10}>
                          <Slider
                            value={sliderValue}
                            onChange={handlerSliderChange}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            getAriaValueText={valuetext}
                            max={10000}
                            style={{ marginLeft: -10 }}
                            marks={[
                              { value: 0, label: "$0" },
                              { value: 10000, label: "$10000" },
                            ]}
                          />
                          <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            onClick={handleApplyRange}
                          >
                            Apply
                          </Button>
                        </Grid>
                      </Grid>
                    </List>
                  </Collapse>
                  <Grid container justifyContent="center">
                    <Button endIcon={<Close />} onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                  </Grid>
                  <Divider style={{ backgroundColor: "grey" }} />
                </Grid>
                {products.map((item) => (
                  <Grid key={item._id} item xs={12} sm={6} md={3}>
                    <Product
                      product={item}
                      handleSelect={handleSelect}
                      selectedIds={selectedIds}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            {showMore && products.length > 0 && (
              <Grid container justifyContent="center">
                <Box margin="16px 0">
                  <Button variant="contained" onClick={handleLoadMore}>
                    LOAD MORE
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "calc(100vh - 60px)" }}
        >
          <img
            src="/empty.svg"
            alt="empty"
            style={{ width: "100%", height: "100%" }}
          />
        </Grid>
      )}
    </>
  );
};

export default ShopPage;
