import * as teamsApi from "../../apis/teams";

// const optionsPerPage = 3;

const loadOptions = async (search, page) => {
  //   await sleep(1000);

  let output = [];

  let filteredOptions;
  let data;
  if (!search) {
    data = await teamsApi
      .getManagers({
        payload: {
          page: page,
          limit: 15,
        },
      })
      .then((results) => {
        //do any results transformations
        return results;
      }).catch(() => {
        return [];
      });
    data.docs?.map(function (item) {
      // output.push({
      //   value: item._id,
      //   label: item.firstName + " " + item.lastName,
      // });
      if (item?.isActive) {
        output.push({
          value: item._id,
          label: item.firstName + " " + item.lastName,
        });
      }

    });
    filteredOptions = output;
  } else {
    output = [];
    data = {};
    data = await teamsApi
      .getManagers({
        payload: {
          page: page,
          limit: 15,
          searchText: search,
        },
      })
      .then((results) => {
        //do any results transformations
        return results;
      }).catch(() => {
        return [];
      });
    data.docs?.map(function (item) {
      // output[item] = obj[item]['value']
      // output.push({
      //   value: item._id,
      //   label: item.firstName + " " + item.lastName,
      // });
      if (item?.isActive) {
        output.push({
          value: item._id,
          label: item.firstName + " " + item.lastName,
        });
      }

    });

    filteredOptions = output;
  }

  return {
    options: filteredOptions,
    hasMore: data.hasNextPage,
  };
};

export default loadOptions;
