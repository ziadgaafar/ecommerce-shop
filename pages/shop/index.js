import ShopPage from "../../components/ShopPage";
import axios from "../../axios";
import Head from "next/head";

const Shop = ({ data, categories }) => {
  return (
    <>
      <Head>
        <title>Shop</title>
      </Head>
      <ShopPage data={data.products} categories={categories} />
    </>
  );
};

export default Shop;

export const getServerSideProps = async () => {
  let response;
  let categories;
  try {
    response = await axios.get(`/products`, {
      params: {
        skip: 0,
        limit: 7,
      },
    });
    categories = await (await axios.get("/categories")).data.categories;
  } catch (err) {
    console.log(err.response.data.message);
  }

  return {
    props: {
      data: response.data,
      categories,
    },
  };
};
