import * as clientsApi from "../../apis/client";

// const optionsPerPage = 3;

const loadClientsOptions = async (search, page) => {

  let output = [];

  let filteredOptions;
  let data;
  if (!search) {
    data = await clientsApi
      .getClients({
        payload: {
          page: page,
          limit: 30,
        },
      })
      .then((results) => {
        //do any results transformations
        return results;
      }); 
    data.result?.docs?.map(function (item) {
      // output[item] = obj[item]['value']
      output.push({
        value: item._id,
        label: item.firstName + " " + item.lastName,
      });
    });
    filteredOptions = output;
  } else {
    // const searchLower = search.toLowerCase();
    output = [];
    data = {};
    data = await clientsApi
      .getClients({
        payload: {
          page: page,
          limit: 20,
          searchText: search,
        },
      })
      .then((results) => {
        return results;
      });
    data.result?.docs?.map(function (item) {
      output.push({
        value: item._id,
        label: item.firstName + " " + item.lastName,
      });
    });
    // member.firstName + " " + member.lastName
    filteredOptions = output;
    // filteredOptions = options.filter(({ label }) =>
    //   label.toLowerCase().includes(searchLower)
    // );
  }
  return {
    options: filteredOptions,
    hasMore: data.hasNextPage,
  };
};

export default loadClientsOptions;
