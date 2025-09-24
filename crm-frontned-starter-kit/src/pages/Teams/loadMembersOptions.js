import * as teamsApi from "../../apis/teams";

// const optionsPerPage = 3;

const loadMembersOptions = async (search, page) => {

  let output = [];

  let filteredOptions;
  let data;
  if (!search) {
    data = await teamsApi
      .getMembers({
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
      // output[item] = obj[item]['value']
      if (item?.isActive) {
        output.push({
          value: item._id,
          label: item.firstName + " " + item.lastName,
        });
      }

    });
    filteredOptions = output;
  } else {
    // const searchLower = search.toLowerCase();
    output = [];
    data = {};
    data = await teamsApi
      .getMembers({
        payload: {
          page: page,
          limit: 15,
          searchText: search,
        },
      })
      .then((results) => {
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

export default loadMembersOptions;
