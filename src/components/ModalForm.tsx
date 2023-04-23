import React, { useState , useEffect , useRef } from "react";
import { useStore, StoreProvider } from "../store/index";

interface Props {
  mode: string;
  indx: number;
}

const style = {
  labels: " text-md font-semibold text-gray-700",
  input: "w-full px-5 py-1 text-gray-700 bg-gray-200 rounded",
};

function ModalForm(props: Props) {
  const [inputValue, setInputValue] = useState("");

  const [selectedOption, setSelectedOption] = useState(null);
  const [deta_name, setData_name] = useState("");

  const { data, addTableData, table_data, updateData } = useStore();
  const [link, setLink] = useState("");
  const [des, setdes] = useState(
    props.mode === "edit" ? table_data[props.indx][2] : ""
  );

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
    setData_name(event.target.value);
    setLink(event.target.value);
  };

  const useDebounce = (value: any, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
    //debounce function
    useEffect(() => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
    }, [value, delay]);
  
    return debouncedValue;
  };
 
  //filtered data when we put query in API
  const [filteringvalue, setfilteringvalue] = useState<any>([]);
  const debouncedInputValue = useDebounce(inputValue, 200);
  const filterDataFromAPi = (inputValue: any) => {
    const data = fetch(`https://api.npms.io/v2/search?q=${inputValue}`)
      .then((response) => response.json())
      .then((data) => setfilteringvalue(data.results))
      .catch((error) => console.error(error));
  };
 


  const handleInputChange = (event: any) => {
    if (debouncedInputValue) {
      filterDataFromAPi(event.target.value);
      
    }
    setInputValue(event.target.value);
    setLink(event.target.link);
    // filterDataFromAPi(event.target.value);
    // setInputValue(event.target.value);
    // setLink(event.target.link);
  };

  const filteredData = data.filter((item: any) => {
    const name = item.package.name.toLowerCase();
    const search = inputValue.toLowerCase();
    return name.includes(search);
  });

  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (selectedOption === null) {
      alert("Please select a package from the list.");
      return;
    }

    if (des.trim() === "") {
      alert("Please provide a reason for selecting this package.");
      return;
    }
    else {
    addTableData(deta_name, link, des);
    console.log(deta_name, link, des);
    closeModal();
  }
  };

  const handleeditSubmit = (event: any) => {
    event.preventDefault();
    updateData(
      props.indx,
      table_data[props.indx][0],
      table_data[props.indx][1],
      des
    );
    console.log(deta_name, link, des);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  //Modal for adding the data
  if (props.mode === "add" && isModalOpen) {
    return (
      <div>
        <div className=" absolute top-0 left-0 bg-[#00000088] w-full h-full z-10 ">
          <div className="absolute top-0 left-[50%] z-10 bg-white rounded-lg border-2 shadow-xl border-purple-300 -translate-x-[50%] p-10 my-[50vh] -translate-y-[50%] w-[60vw] ">
            {/* <button onClick={openModal}>Open Modal Form</button> */}

            <div className="modal">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col">
                    <label className={style.labels}>
                      Search for a NPM package:
                    </label>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      className={style.input}
                    />
                  </div>
                  <br />
                  <div className="flex flex-col">
                    <ul className="h-[20vh] overflow-scroll">
                      {filteringvalue &&
                        filteringvalue.map((item: any) => (
                          <div
                            key={item.name}
                            className="flex items-center text-lg"
                          >
                            <label className={style.labels}>
                              {item.package.name}
                            </label>
                            <span>
                              <input
                              required
                                type="radio"
                                value={item.package.name}
                                checked={
                                  selectedOption === `${item.package.name}`
                                }
                                onChange={handleOptionChange}
                                onChangeCapture={async () => {
                                  setLink(await item.package.links.npm);
                                }}
                              />
                       
                            </span>
                          </div>
                        ))}
                    </ul>
                    {selectedOption === null && (     <div className="invalid-feedback text-red-400 text-sm mt-1">
      Please select a package.
    </div>)}
               
                  </div>
                  <br />
                  <div className="flex flex-col">
                    <label className={style.labels}>
                      Why is this your favorite package?
                    </label>
                    <input
                      type="text"
                      className={`h-[10rem] ${style.input}`}
                      placeholder="Enter your answer here"
                      value={des}
                      onChange={(event) => setdes(event.target.value)}
                      required
                    />
                    {des.trim() === "" && (    
                      <div className="empty-feedback invalid-feedback text-red-400 text-sm mt-1">
                      Please enter your message.
                    </div>
                     )}
                  </div>
                  <br />
                  <div className="flex w-full justify-between">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center w-full px-4 py-2 mb-2 text-lg text-white bg-green-500 rounded-md hover:bg-green-400 sm:w-auto sm:mb-0"
                      data-primary="green-400"
                      data-rounded="rounded-2xl"
                      data-primary-reset="{}"
                    >
                      Add
                      <svg
                        className="w-4 h-4 ml-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </button>
                    {/* <button type="submit">Submit</button> */}
                    <button
                      type="button"
                      onClick={closeModal}
                      className="inline-flex items-center justify-center w-full px-4 py-2 mb-2 text-lg text-white bg-red-500 rounded-md hover:bg-red-400 sm:w-auto sm:mb-0"
                      data-primary="green-400"
                      data-rounded="rounded-2xl"
                      data-primary-reset="{}"
                    >
                      Close
                      <svg
                        className="w-4 h-4 ml-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </button>
                    {/* <button onClick={closeModal}>Close</button> */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  //Modal for viewing existing data
  if (props.mode === "view" && isModalOpen) {
    return (
      <div>
        <div className=" absolute top-0 left-0 bg-[#00000088] w-full h-full z-10 ">
          <div className="absolute top-0 left-[50%] z-10 bg-white rounded-lg border-2 shadow-xl border-purple-300 -translate-x-[50%] p-10 my-[50vh] -translate-y-[50%] w-[60vw] ">
            {/* <button onClick={openModal}>Open Modal Form</button> */}

            <div className="modal">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <br />
                  <div className="flex flex-col ">
                    <p className="text-4xl text-slate-700">
                      {table_data[props.indx][0]}
                    </p>
                    <a
                      href={table_data[props.indx][1]}
                      target="_blank"
                      className="hover:underline"
                    >
                      {table_data[props.indx][1]}
                    </a>
                  </div>
                  <br />
                  <div className="flex flex-col">
                    <label className={style.labels}>
                      This is your favorite package because:
                    </label>
                    {table_data[props.indx][2]}
                  </div>
                  <br />
                  <div className="flex w-full justify-between">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="inline-flex items-center justify-center w-full px-4 py-2 mb-2 text-lg text-white bg-red-500 rounded-md hover:bg-red-400 sm:w-auto sm:mb-0"
                      data-primary="green-400"
                      data-rounded="rounded-2xl"
                      data-primary-reset="{}"
                    >
                      Close
                      <svg
                        className="w-4 h-4 ml-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </button>
                    {/* <button onClick={closeModal}>Close</button> */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  //Modal for editing existing data
  if (props.mode === "edit" && isModalOpen) {
    return (
      <div>
        <div className=" absolute top-0 left-0 bg-[#00000088] w-full h-full z-10 ">
          <div className="absolute top-0 left-[50%] z-10 bg-white rounded-lg border-2 shadow-xl border-purple-300 -translate-x-[50%] p-10 my-[50vh] -translate-y-[50%] w-[60vw] ">
            {/* <button onClick={openModal}>Open Modal Form</button> */}
            <h1 className="text-xl font-bold text-slate-600">Edit Mode</h1>
            <div className="modal">
              <div className="modal-content">
                <form onSubmit={handleeditSubmit}>
                  <br />
                  <div className="flex flex-col ">
                    <p className="text-4xl text-slate-700">
                      {table_data[props.indx][0]}
                    </p>
                    <a
                      href={table_data[props.indx][1]}
                      target="_blank"
                      className="hover:underline"
                    >
                      {table_data[props.indx][1]}
                    </a>
                  </div>
                  <br />
                  <div className="flex flex-col">
                    <label className={style.labels}>
                      This is your favorite package because:
                    </label>
                    <input
                      type="text"
                      className={`h-[10rem] ${style.input}`}
                      value={des}
                      defaultValue={des}
                      onChange={(event) => setdes(event.target.value)}
                    />
                  </div>
                  <br />
                  <div className="flex w-full justify-between">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center w-full px-4 py-2 mb-2 text-lg text-white bg-green-500 rounded-md hover:bg-green-400 sm:w-auto sm:mb-0"
                      data-primary="green-400"
                      data-rounded="rounded-2xl"
                      data-primary-reset="{}"
                    >
                      Update
                      <svg
                        className="w-4 h-4 ml-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="inline-flex items-center justify-center w-full px-4 py-2 mb-2 text-lg text-white bg-red-500 rounded-md hover:bg-red-400 sm:w-auto sm:mb-0"
                      data-primary="green-400"
                      data-rounded="rounded-2xl"
                      data-primary-reset="{}"
                    >
                      Close
                      <svg
                        className="w-4 h-4 ml-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </button>
                    {/* <button onClick={closeModal}>Close</button> */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default ModalForm;
