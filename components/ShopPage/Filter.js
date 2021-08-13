import { Grid } from "@material-ui/core";
import CategoriesMenu from "./CategoriesMenu";

const Filter = ({ value, categories, categoryValue, setCategoryValue }) => {
  switch (value) {
    case "category":
      return (
        <Grid container>
          <CategoriesMenu
            value={categoryValue}
            setValue={setCategoryValue}
            values={categories}
          />
        </Grid>
      );
    default:
      return;
  }
};

export default Filter;
