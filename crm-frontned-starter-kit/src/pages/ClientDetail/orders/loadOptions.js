import * as ordersApi from "../../../apis/orders";

// const optionsPerPage = 3;

const loadOptions = async (search, page) => {
  //   await sleep(1000);

  let output = [];

  let filteredOptions;
  let data;
  if (!search) {
    data = await ordersApi
      .getMarkets({
        payload: {
          page: page,
          limit: 5,
        },
      })
      .then((results) => {
        //do any results transformations
        return results;
      });
    data.docs?.map(function (item) {
      output.push({
        value: item.pairName,
        label: item.pairName,
      });
    });
    filteredOptions = output;
  } else {
    output = [];
    data = {};
    data = await ordersApi
      .getMarkets({
        payload: {
          page: page,
          limit: 3,
          searchText: search,
        },
      })
      .then((results) => {
        //do any results transformations
        return results;
      });
    data.docs?.map(function (item) {
      // output[item] = obj[item]['value']
      output.push({
        value: item.pairName,
        label: item.pairName,
      });
    });

    filteredOptions = output;
  }

  return {
    options: filteredOptions,
    hasMore: data.hasNextPage,
  };
};

export default loadOptions;