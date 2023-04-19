import React, { useState } from "react";
import { useStore, StoreProvider } from '../store/index';

const style = {
  labels: " text-md font-semibold text-gray-700",
  input: "w-full px-5 py-1 text-gray-700 bg-gray-200 rounded",
};

function ModalForm(props) {
  const [inputValue, setInputValue] = useState('');


  const [selectedOption, setSelectedOption] = useState(null);
  const [deta_name, setData_name] = useState('');
  const [link, setLink] = useState('');
  const [des, setdes] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setData_name(event.target.value);
    setLink(event.target.value);
  }

  // const filteredData = filterDataByName('react');
 
  // const addData = (data) => {
  //   setaddData([...add_data, data]);
  // }


  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setLink(event.target.link);
  };

  const { data, filterDataByName , addTableData, table_data} = useStore();

  // const filteredData = filterDataByName('react');
 
  const filteredData = data.filter(item => {
    const name = item.package.name.toLowerCase();
    // const search = inputValue.toLowerCase();
    const search = inputValue.toLowerCase();
    return name.includes(search);
  });

  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    addTableData(deta_name , link);
    // setTableData("added");
    closeModal();
  };

  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>    {isModalOpen && (
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
        {filteredData.map(item => (
          <div key={item.name} className="flex items-center text-lg">
           <label className={style.labels}>{item.package.name}</label>
           <span>
             <input
               type="radio"
               value={item.package.name}
               checked={selectedOption === `${item.package.name}`}
               onChange={handleOptionChange}
               onChangeCapture={async () => {
                setLink(await item.package.links.npm);
              }}
             />
             
           </span>
          </div>
        ))}
      </ul>
                  
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
    )}
    </>

  );
}

export default ModalForm;
