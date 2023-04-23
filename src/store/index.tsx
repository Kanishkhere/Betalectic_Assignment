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
  addTableData: (name: any, link: any, description: any) => void;
  table_data: [any, any ,any][];
  deleteData: (deletedata: any) => void;
  updateData: (index: number, name: any, link: any, description: any) => void;
}

const StoreContext = createContext<Store>({
  data: [],
  filterDataByName: () => {},
  addTableData: () => {},
  table_data: [],
  deleteData: () => {},
  updateData: () => {},
});

function useStore() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
}

//we will  make a function to call the api and store the data in the state
function StoreProvider({ children }:any) {
  const [data, setData] = useState<SearchResult[]>([]);
  const [filtereddata, setfilteredData] = useState<SearchResult[]>([]);
  const [table_data, setTableData] = useState(JSON.parse(typeof window !== 'undefined' && window.localStorage.getItem('table_data') || '[]'));


  useEffect( () => {
    fetch('https://api.npms.io/v2/search?q=reactjs')
      .then(response => response.json())
      .then(data => setData(data.results))
      // .then(data => console.log(data))
      // .then(data => setData(data))
      .catch(error => console.error(error));
      // console.log(data);
  }, []);

  useEffect(() => {
    localStorage.setItem('table_data', JSON.stringify(table_data));
  }, [table_data]);
  //updates the existing enteries in the table
  const updateData = (index: number, name: any, link: any, description: any) => {
    const updatedTableData = [...table_data];
    updatedTableData[index] = [name, link, description];
    setTableData(updatedTableData);
  }

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

  const addTableData = (name: any , link: any, description: any) => {
    for (let i = 0; i < table_data.length; i++) {
      const item = table_data[i];
      if (item[i] == name) {
        alert("already added");
        return;
      }
    }
    setTableData([...table_data, [name , link, description]]);
  }

  const filterDataByName = (name: any) => {
    const filteredData: any = [];
    console.log(data,"data")
    for (let i = 0; i < data.length; i++) {
      if (data[i].package.name != name) {
        filteredData.push(data[i]);
      }
    }
    return filteredData;
  };

  const store = {
    data,
    filterDataByName,
    addTableData,
    table_data,
    deleteData,
    filtereddata,
    updateData
  };

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

export { useStore, StoreProvider };
