import Header from "@/components/layout/Header"
import MenuSidebar from "@/components/layout/menu-sidebar"

import {fetchProductToServer} from '@/app/apis/index'
import {  showProducts } from "@/app/apis";
import { ProductProps } from "@/types";


import LargeProductDetails from "@/components/details/LargeProductDetails";
import SmallProductDetails from "@/components/details/SmallProductDetails";
import ProgressNav from "@/components/layout/ProgressNav";

interface prop {
    category:string;
    item:string
}

type ParamsProps = {
  params: { category: string , item:string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const page = async ({params}:ParamsProps) => {
   const {category,item} = params;
   const product = await fetchProductToServer(category , item); 

  return (
    <>
    <Header page='details' heading='All products' /> 
    <MenuSidebar />
    <div className="product-details-page">
        <div className="container">
        <LargeProductDetails product={product as ProductProps} category={category}/>
        <SmallProductDetails product={product as ProductProps} category={category}/>    
        </div> 
    </div>
    </>
  )
  
}

export default page

