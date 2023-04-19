import { useState, useEffect, createContext, useContext } from 'react';

// const StoreContext = createContext(null);

interface Package {
  name: string;
  link: string;
  // other properties...
}

interface SearchResult {
  package: Package;
  // other properties...
}

interface Store {
  data: SearchResult[];
  filterDataByName: (name: any) => any;
  addTableData: (name: any, link: any) => void;
  table_data: [any, any][];
  deleteData: (deletedata: any) => void;
}

const StoreContext = createContext<Store>({
  data: [],
  filterDataByName: () => {},
  addTableData: () => {},
  table_data: [],
  deleteData: () => {},
});

function useStore() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
}

function StoreProvider({ children }:any) {
  const [data, setData] = useState<SearchResult[]>([]);
  const [table_data, setTableData] = useState(
    Array<[any, any]> 
  );

  useEffect( () => {
    fetch('https://api.npms.io/v2/search?q=reactjs')
      .then(response => response.json())
      .then(data => setData(data.results))
      // .then(data => console.log(data))
      // .then(data => setData(data))
      .catch(error => console.error(error));
      // console.log(data);
  }, []);

  const deleteData = (deletedata: any) => {
    const newData: any = [];
    for (let i = 0; i < table_data.length; i++) {
      const item = table_data[i];
      if (item[i] !== deletedata) {
        newData.push(item);
      }
    }
    setTableData(newData);
  };

  const addTableData = (name: any , link: any) => {
    for (let i = 0; i < table_data.length; i++) {
      const item = table_data[i];
      if (item[i] == name) {
        alert("already added");
        return;
      }
    }
    setTableData([...table_data, [name , link]]);
  }

  const filterDataByName = (name: any) => {
    const filteredData: any = [];
    console.log(data,"data")
    for (let i = 0; i < data.length; i++) {
      if (data[i].package.name != name) {
        filteredData.push(data[i]);
        console.log(data[i].package.name)
      }
    }
    return filteredData;
  };

  // const filterData = (filterFunction) => {
  //   return data.filter(filterFunction);
  // }

  const store = {
    data,
    filterDataByName,
    addTableData,
    table_data,
    deleteData
  };

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

export { useStore, StoreProvider };
