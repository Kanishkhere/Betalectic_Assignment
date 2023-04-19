import Image from 'next/image'
import { Inter } from 'next/font/google'
import React, { useState } from 'react';
import Btton from '@/components/Btton';
import ModalForm from '@/components/ModalForm';
import { useStore, StoreProvider } from '../store/index';
import { AiOutlineEye , AiFillDelete , AiFillEdit} from "react-icons/ai";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data, filterDataByName , addTableData, table_data , deleteData} = useStore();

  const filteredData = data.filter(item => {
    const name = item.package.name.toLowerCase();
    // const search = inputValue.toLowerCase();
    const search = "react";
    return name.includes(search);
  });

  const [favorites, setFavorites] = useState([]);
  const [buttonPosition, setButtonPosition] = useState('center');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [acceptalert, setacceptalert] = useState(false);
  const [selvar , setSelvar] = useState(0);

  const addFavorite = (item) => {
    setIsModalOpen(isModalOpen => !isModalOpen);
  }
 
  const deleteFavorite = async (item) => {
    deleteData(item);
    setacceptalert(false)
  }


  return (
    <main className="flex min-h-screen flex-col p-24 font-mono">
      {isModalOpen && (
        <ModalForm/>
      )}
      {
        acceptalert && (
          <div className='h-[100%] w-[100%] bg-[rgba(7,5,15,0.67)] absolute top-0 left-0'>
          <div className='absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] z-50 bg-white border-2 p-11 rounded-xl shadow-xl flex flex-col justify-center items-center'>
            <h1 className='text-2xl font-mono text-left'>Are you sure you want to delete this package?</h1>
            <div className='flex justify-evenly w-full mt-10'>
            <button onClick={() => deleteFavorite(selvar)} >
            <Btton vallue="Yes"/>
            </button>
            <button onClick={() => setacceptalert(false)} >
            <Btton vallue="No"/>
            </button>
            </div>
          </div>
          </div>
        )
      }
      <div>
    </div>  
      <div className='flex'>
      <h1 className='text-5xl font-mono text-left'>Welcome to Favorite NPM Package</h1>
      {table_data.length > 0 && 
        <div className='mx-auto flex-col flex'>
         <button
         onClick={() => addFavorite('New Favorite')}  >
        <Btton vallue="Add Fav"/>
        </button>
    </div> 
        }
      </div>
      <div className='flex flex-col mt-20 min-h-[40vh] h-fit my-aut0 border-2 overflow-hidden rounded-lg shadow-xl items-center'>
        {table_data.length === 0 && 
        <div className='mx-auto flex-col flex my-auto'>
        <h2 className='text-2xl font-mono text-left'>You have no favorites</h2>
        <button onClick={() => addFavorite('New Favorite')} >
        <Btton vallue="Add Fav"/>
        </button>
    </div> 
        }
        {table_data.length > 0 && 
      <table className='w-full max-h-full overflow-hidden  rounded-lg'>
        <thead>
          <tr>
            <th className='text-2xl p-2  border-2 border-slate-400'>Package Name</th>
            <th className='text-2xl p-2  border-2 border-slate-400'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {table_data.map((data, index) => (
            <tr key={index}>
              <td className=' border-2 border-slate-400 p-2'>{data[0]}</td>
              <td className='px-[10%] flex justify-evenly items-center border-2 border-slate-400 p-2'>
              <a href={data[1]} target='_blank'><AiOutlineEye className='h-[1.5em] w-[1.5em] text-slate-700'/>
                </a>
                <button onClick = { (()=>{
                  setacceptalert(true);
                  setSelvar(data[index]);
                })}>
                <AiFillDelete className='h-[1.5em] w-[1.5em] text-slate-700'/>
                </button>
                <a>
                <AiFillEdit  className='h-[1.5em] w-[1.5em] text-slate-700'/>
                </a>
                </td>
              {/* <td className=' border-2 border-slate-400 p-2'>{data[1]}</td> */}
            </tr>
          ))}
          
        </tbody>
      </table>
}
    </div>
    </main>
  )
}
