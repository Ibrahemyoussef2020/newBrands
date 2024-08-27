'use client'

import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import {customStringIncludes, filterProductsList} from '@/utilities'
import { FilterInputProps, FilterProps, FilterSidebarProps, ProductProps } from '@/types';
import DropArrow from '../general/DropArrow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { setFips } from 'crypto';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {toggleMobileAsideFilter} from '@/redux/slices';
import { IRootState } from '@/redux/store';


let ratingValues:string[]|[] = [];
let brandValues:string[]|[] = [];


interface StringProductProps{ 
  [name:string]:string
}

interface BooleanProductProps{
  [name:string]:boolean
}


const FilterSidebar = (props:FilterSidebarProps) => {
  const {
  handleFilter,
  selectedValue,
  constantList,
  setProducts,
  filtersClear,
  setFiltersClear,
  filterRemove,
  setFilterRemove,
  filterSelectedList,
  setFilterSelectedList
  } = props;

  const dispatch = useDispatch();
  const {isOppend } =  useSelector((state:IRootState)=> state.asideFilter)


  const [minPriceFromData,setMinPriceFromData] = useState<number>(0);
  const [maxPriceFromData,setMaxPriceFromData] = useState<number>(2000);

  const [minPriceValue,setMinPriceValue] = useState<number>(minPriceFromData) 
  const [maxPriceValue,setMaxPriceValue] = useState<number>(maxPriceFromData) 

  const [visibleSection , setVisibleSection]  = useState(['category','brand' , 'features' , 'price' , 'color' ,'rating']);

  const [productsColor, setProductsColor] = useState<string[]| []>([])
  const [productsBrand, setProductsBrand] = useState<string[]| []>([])
  const [productsType, setProductsType] = useState<string[]| []>([])

  const [selectedType,setSelectedType] = useState<string>('')


  const ref_premium_offer = useRef<HTMLInputElement[]>([]);
  const ref_free_delivery = useRef<HTMLInputElement[]>([])
  const ref_to_home = useRef<HTMLInputElement[]>([])

  const ref_typeEls = useRef<HTMLInputElement[]>([])
  const ref_ratingEls = useRef<HTMLInputElement[]>([])
  const ref_brandEls = useRef<HTMLInputElement[]>([])
  const ref_colorEls = useRef<HTMLInputElement[]>([])
  

  useEffect(()=>{
    const colors = new Set(constantList.map((product:ProductProps )=> product.color))
    setProductsColor(Array.from(colors))

    const brands = new Set(constantList.map(product => product.brand))
    setProductsBrand(Array.from(brands))

    const types = new Set(constantList.map(product => product.type))
    setProductsType(Array.from(types))

    const prices = constantList.map((product:ProductProps)=> product.price)

    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.floor(Math.max(...prices));
    
    setMinPriceFromData(minPrice);
    setMaxPriceFromData(maxPrice);


    if (filterRemove.name !== '') {
     handleUnCheckInput(filterRemove)
    }

    if (filtersClear) {
      handleClearFilters()
    }

  },[selectedValue,filterRemove,filtersClear,minPriceValue,maxPriceValue,visibleSection,constantList])

  //________________ price _______________________//


  const handleMinMaxPrice = (e:React.ChangeEvent<HTMLInputElement>,minMax:string)=>{
    
    if (minMax === 'min') {
      setMinPriceValue(+e.target.value)
    }
    else{
      setMaxPriceValue(+e.target.value)
    }
  }

  const submitMinMix = ()=>{
    handleFilter({
      prop: 'price',
      value:'0',
      values:[],
      checked: true,
      type: 'minmax',
      filterFn:(product:ProductProps,filter:FilterProps) => product.price > +minPriceValue && product.price < +maxPriceValue,
    }, true)
    
  }  


      
  //_______________ filter boolean _______________//
 
  
    const handleBooleanValues = (e:React.ChangeEvent<HTMLInputElement>) => {

      const prop = e.target.name;

      handleFilter({
        prop: prop,
        checked: e.target.checked,
        value:e.target.value,
        values:[],
        type: 'boolean',
        filterFn:(product:ProductProps,filter:FilterProps) => product[prop as keyof  ProductProps]?.toString() === filter.checked.toString()
        
      }, e.target.checked)

      setFiltersClear(false)
      setFilterRemove({name:'',value:''})
      
    }
    
  //_______________ filter radio _______________//

    const handleRadioValues = (e:React.ChangeEvent<HTMLInputElement>) => {

      if (e.target.name === 'type') {
        setSelectedType(e.target.value)
      }

      const prop = `${e.target.name}`;

      handleFilter({
        prop: prop,
        value: e.target.value,
        values:[],
        checked: e.target.checked,
        type: 'custom',
        filterFn: (product:ProductProps,filter:FilterProps) => product[prop as keyof  ProductProps] === e.target.value,
      }, true)

      setFiltersClear(false)
      setFilterRemove({name:'',value:''})
 
    }

   //_______________ filter list check _______________// 


   const handleFilterBrand = (e:React.ChangeEvent<HTMLInputElement>)=>{

        if (e.target.checked) {
            brandValues = [...brandValues,e.target.value]
        }
        else{
          brandValues = brandValues.filter((brand:string )=> brand !== e.target.value);
          
        }

        const prop = e.target.name;

        handleFilter({
          prop: prop,
          checked: e.target.checked,
          type: 'list',
          value:e.target.value,
          values: brandValues,
          filterFn: (product:ProductProps,filter:FilterProps) => customStringIncludes(filter.values,product.prop),
      } , e.target.checked)

      setFiltersClear(false)
      setFilterRemove({name:'',value:''}) 
   }


   const handleFilterRating = (e:React.ChangeEvent<HTMLInputElement>)=>{

    if (e.target.checked) {
        ratingValues = [...ratingValues,e.target.value]
    }
    else{
      ratingValues = ratingValues.filter((rate:string )=> rate !== e.target.value)
    }

    const prop = e.target.name;

    handleFilter({
      prop: prop,
      checked: e.target.checked,
      type: 'list',
      value:e.target.value,
      values: ratingValues,
      filterFn:(product:ProductProps,filter:FilterProps) => customStringIncludes(filter.values,product.prop),
  } , e.target.checked)

  setFiltersClear(false)
  setFilterRemove({name:'',value:''}) 
}

//_______________  unCheck input _______________//


const handleUnCheckInput = (filter:FilterInputProps)=>{

  if (filter.name === 'premium_offer' || filter.name === 'free_delivery' || filter.name === 'to_home' || filter.name === 'verified') {
      if (filter.name === 'premium_offer') {
        if (ref_premium_offer) {
          ref_premium_offer.current.map((ref:HTMLInputElement )=> ref.checked = false);
        }
      }
      else if (filter.name === 'free_delivery') {
        ref_free_delivery.current.map((ref:HTMLInputElement )=> ref.checked = false);  
      }
      else if (filter.name === 'to_home') {
       ref_to_home.current.map((ref:HTMLInputElement )=> ref.checked = false)   
      }

      const prop = filter.name

      handleFilter({
        prop:filter.name,
        checked:false,
        value:filter.value,
        values:[],
        type: 'boolean',
        filterFn:(product:ProductProps,filter:FilterProps) => product[prop as keyof  ProductProps]?.toString() === filter.checked.toString()
      }, false)

      setFiltersClear(false)
      setFilterRemove({name:'',value:''})

  }
  else {

    const prop = filter.name;

      if (filter.name === 'type' || filter.name === 'color') {
          handleFilter({
            prop:prop,
            value:filter.value,
            values:[],
            checked:false,
            type: 'custom',
            filterFn: (product:ProductProps,filter:FilterProps) => product.prop === filter.value,
          }, false)
      }
      else if (filter.name === 'brand'){

        brandValues = brandValues.filter((brand:string )=> brand !== filter.value)

        console.log(brandValues);
        

        handleFilter({
          prop:filter.name,
          checked:false,
          type: 'list',
          value:filter.value,
          values: brandValues,
          filterFn:(product:any,customFilter:any) => customFilter.values.includes(product[filter.name]),
        } ,true)

        setFilterRemove({name:'',value:''})
      } 
      else if (filter.name === 'avgRating'){


        ratingValues = ratingValues.filter((rate:string )=> rate != filter.value)

        handleFilter({
          prop:filter.name,
          checked:false,
          type: 'list',
          value:filter.value,
          values: ratingValues,
          filterFn:(product:any,customFilter:any) => customFilter.values.includes(product[filter.name]),
        } ,true)
      }


      const curentRef = filter.name === 'type' ?  ref_typeEls
      : filter.name === 'avgRating' ? ref_ratingEls
      : filter.name === 'brand' ? ref_brandEls
      : filter.name === 'color' ? ref_colorEls
      : null

      if (curentRef) { 
          curentRef.current.map((ref:HTMLInputElement )=> ref.value === filter.value ? ref.checked = false : null)
      }

      setFiltersClear(false)
      setFilterRemove({name:'',value:''})

      if (filter.name === 'avgRating') {
        ratingValues = ratingValues.filter(value => value !== filter.value);
      }
      else if (filter.name === 'brand') {
        brandValues = brandValues.filter(value => value !== filter.value);
      }
  }
}


//_______________  remove filter _______________//


  const handleRemoveFilter = (filter:string)=>{
        if (filter === 'premium_offer') {
         ref_premium_offer.current.map((ref:HTMLInputElement )=> ref.checked = false)
        }
        else if (filter === 'free_delivery') {
         ref_free_delivery.current.map((ref:HTMLInputElement )=> ref.checked = false)
        }
        else if (filter === 'to_home') {
         ref_to_home.current.map((ref:HTMLInputElement )=> ref.checked = false)
        }
        else {

        const curentRef = filter === 'type' ?  ref_typeEls
        : filter === 'avgRating' ? ref_ratingEls
        : filter === 'brand' ? ref_brandEls
        : filter === 'color' ? ref_colorEls
        : null

        if (curentRef) { 
           curentRef.current.map((ref:HTMLInputElement )=> ref.checked = false)
        }
        setFiltersClear(false)
        setFilterRemove({name:'',value:''})
    }

    if (filter === 'avgRating') {
      ratingValues = [];
    }
    else if (filter === 'brand') {
      brandValues = [];
    }


    handleFilter({
      prop:filter,
      checked:true,
      type: 'remove-filter',
      value:'',
      values:[],
      filterFn: (product:ProductProps,filter:FilterProps) => true,
    } , true)

    setFiltersClear(false)
    setFilterRemove({name:'',value:''})
  }


  //_______________ Clear all filters _______________//

  function handleClearFilters(){
    if (filtersClear) {
      ref_premium_offer.current.map((ref:HTMLInputElement )=> ref.checked = false)
      ref_free_delivery.current.map((ref:HTMLInputElement )=> ref.checked = false);
      ref_to_home.current.map((ref:HTMLInputElement )=> ref.checked = false) 
      
      ref_typeEls.current?.filter((ref:HTMLInputElement)  => ref !== null)
      .map((ref:HTMLInputElement)  => ref.checked = false)
      ref_ratingEls.current.filter((ref:HTMLInputElement)  => ref !== null)
      .map((ref:HTMLInputElement)  => ref.checked = false)
      ref_brandEls.current.filter((ref:HTMLInputElement)  => ref !== null)
      .map((ref:HTMLInputElement)  => ref.checked = false)
      ref_colorEls.current.filter((ref:HTMLInputElement)  => ref !== null)
      .map((ref:HTMLInputElement)  => ref.checked = false)


      brandValues = [];
      ratingValues = []
     
        handleFilter({
          prop:'',
          checked:true,
          type: 'clear',
          value: '',
          values:[],
          filterFn: (product:ProductProps,filter:FilterProps) => true,
        } , false)

      }
  }

//_______________ prop arrows  _______________//

  const toggleArrowDrop = (value:string)=>{
    if (customStringIncludes(visibleSection,value)) {
      const list = visibleSection.filter((string:string) => {
        return string !== value
      })
      setVisibleSection(list)

    }else{
      const list = [...visibleSection,value];
      setVisibleSection(list)
    }
  }

//_______________ Dom  _______________//
 
    return (
      <aside className={`filter-aside ${isOppend ? 'open' : 'closed'}`}>
  
        <button className={`close`} onClick={_=>dispatch(toggleMobileAsideFilter(false))}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
  {/***********************  category  ************************** */}
  
      <article 
          className={`category filter-section 
            ${customStringIncludes(visibleSection,'category') ? 'drop-dowen' : 'pull-up'}
          `}>
          <div className='filter-header'>
            <h3>Category</h3>
            <button onClick={()=>toggleArrowDrop('category')}>
              <DropArrow  list={visibleSection} item='category'/>
            </button>
          </div>

          <div className='filter-body'>
            <h4>
              <span>{selectedValue}</span> 
            </h4>
            <button className="clear " onClick={_=> handleRemoveFilter('type')}>
              <FontAwesomeIcon icon={faTrashCan} />
              <span>remove filter</span> 
            </button>
            {
            productsType?.length ? 

            productsType.map((type,index) => {
                return (
                  <label  key={type +''+ index} className={`${index <= 5 ? 'less-than-5' : 'more-than-5'}`}>
                  <input
                    onChange={handleRadioValues} 
                    type="radio" 
                    name="type" 
                    value={type} 
                    ref={(el:any) => (ref_typeEls.current[index] = el)}
                    />
                  <span>{selectedValue.slice(0,-1)} a {type}</span>
                </label>
                )
            })
              :
            null
          }
          </div>

          <div className='filter-footer'>
            <Link href='#' className='not-allowed' >
              See all
            </Link>
          </div>
      </article>

  {/******************  brand  handleRemoveFilter('brand')  ************************* */}
        
        <article 
            className={`brand filter-section 
            ${customStringIncludes(visibleSection,'brand') ? 'drop-dowen' : 'pull-up'}
            `}>

          <div className='filter-header'>
            <h3>Brand</h3>
            <button onClick={()=>toggleArrowDrop('brand')}>
              <DropArrow  list={visibleSection} item='brand'/>
            </button>
          </div>

          <div className='filter-body'>
            <button className="clear pb-2"  onClick={_=> handleRemoveFilter('brand')}>
                <FontAwesomeIcon icon={faTrashCan} />
                <span>remove filter</span> 
            </button>
            {
            productsBrand && productsBrand.length  ?
              productsBrand.map((brand,index) => {
                  return <label key={brand +''+ index} className={`${index <= 5 ? 'less-than-5' : 'more-than-5'}`}>
                  <input
                    onChange={handleFilterBrand} 
                    type="checkbox" 
                    name="brand" 
                    value={brand}
                    data-values={brandValues}
                    ref={(el:any) => (ref_brandEls.current[index] = el)}
                    />
                  <span>{brand[0].toUpperCase()}{brand.slice(1)}</span>
                </label>
              }  
            )
            : null}
          </div>

          <div className='filter-footer'>
            <Link href='#' className='not-allowed' >
              See all
            </Link>
          </div>     
        </article>
      
  {/******************  Fetured  ************************* */}

        <article 
          className={`features filter-section 
            ${customStringIncludes(visibleSection,'features') ? 'drop-dowen' : 'pull-up'}
        `}>

          <div className='filter-header'>
            <h3>Features</h3>
            <button onClick={()=>toggleArrowDrop('features')}>
              <DropArrow  list={visibleSection} item='features'/>
            </button>
          </div>

          <div className='filter-body'>
              <button className="clear pt-1" onClick={()=> {
                handleRemoveFilter('premium_offer')
                handleRemoveFilter('free_delivery')
                handleRemoveFilter('to_home')
              }}
              >
                <FontAwesomeIcon icon={faTrashCan} />
                <span>remove filter</span> 
              </button>


              <label>
                <input
                  onChange={handleBooleanValues}
                  type="checkbox"
                  id="premium_offer"
                  name="premium_offer"
                  value="premium_offer"
                  ref={(el:any) => (ref_premium_offer.current[0] = el)}
                />
                <span className={`label__sub-title ml-1`}>
                  Enabled in Premium          
                </span>
              </label>

              <label>
                <input
                  onChange={handleBooleanValues}
                  type="checkbox"
                  id="free_delivery"
                  name="free_delivery"
                  value="free_delivery"
                  ref={(el:any) => (ref_free_delivery.current[0] = el)}
                />
                <span className={`label__sub-title ml-2`}>
                  Free delivery
                </span>
              </label>
              <label>
                <input
                  onChange={handleBooleanValues}
                  type="checkbox"
                  id="to_home"
                  name="to_home"
                  value="to_home"
                  ref={(el:any) => (ref_to_home.current[0] = el)}
                />
                <span className={`label__sub-title ml-2`}>
                  Git it to Home
                </span>
              </label>
          </div>

          <div className='filter-footer'></div>
        </article>  

  {/***********************  price  ************************** */}

        <article 
          className={`price filter-section 
            ${customStringIncludes(visibleSection,'price') ? 'drop-dowen' : 'pull-up'}
        `}>

            <div className='filter-header'>
              <h3>Price range</h3>
              <button onClick={()=>toggleArrowDrop('price')}>
                <DropArrow  list={visibleSection} item='price'/>
              </button>
            </div>

            <div className='filter-body'>
              <button className="clear pb-2"  onClick={_=> handleRemoveFilter('price')}>
                <FontAwesomeIcon icon={faTrashCan} />
                <span>remove filter</span> 
              </button>
              <div className='ranges'>
                <div className='range'>
                  <input type="range" id="min-price" name="min-price" min={minPriceFromData} max={maxPriceFromData} value={minPriceValue} onChange={(e)=>handleMinMaxPrice(e,'min')} className='price no-check-shape'/>
                </div>
                <div className='range'>
                  <input type="range" id="max-price" name="max-price" min={minPriceFromData} max={maxPriceFromData} value={maxPriceValue} onChange={(e)=>handleMinMaxPrice(e,'max')} className='price no-check-shape'/>
                </div>
              </div>
              <div className='numbers'>
                  <div>
                    <h4>Min</h4>
                    <input type="number" min={minPriceFromData} max={maxPriceFromData}  value={minPriceValue} onChange={(e)=>handleMinMaxPrice(e,'min')} placeholder='0' />
                  </div>
                 <div>
                  <h4>Max</h4>
                  <input type="number" min={minPriceFromData} max={maxPriceFromData} value={maxPriceValue} onChange={(e)=>handleMinMaxPrice(e,'max')} placeholder='999'/>
                 </div>
              </div>

              <button className='apply' onClick={submitMinMix}>
                Apply
              </button>
            </div>

            <div className='filter-footer'></div>
        </article>        

  {/***********************  color  ************************** */}
  
       <article 
          className={`color filter-section 
          ${customStringIncludes(visibleSection,'color') ? 'drop-dowen' : 'pull-up'}
      `}>

        <div className='filter-header'>
          <h3>Color</h3>
          <button onClick={()=>toggleArrowDrop('color')}>
            <DropArrow  list={visibleSection} item='color'/>
          </button>
        </div>

        <div className="filter-body">
            <button className="clear pt-1 mb-1 ml-3" onClick={_=> handleRemoveFilter('color')}>
              <FontAwesomeIcon icon={faTrashCan} />
              <span>remove filter</span> 
            </button>
            
            <div className="less-items">
            { 
            productsColor?.length && 
            productsColor
            .map((color,index) =>{
                  return <label key={color +''+ index} className={`${index <= 5 ? 'less-than-5' : 'more-than-5'}`}>
                  <input
                    onChange={handleRadioValues} 
                    type="radio" 
                    name="color" 
                    value={color}
                    ref={(el:any) => (ref_colorEls.current[index] = el)}
                    />
                  <span>{color}</span>
                </label>
              }
              )   
            }
            </div>
        </div>

        <div className='filter-footer'>
          <Link href='#' className='not-allowed' >
              See all
          </Link>
        </div> 

       </article>      
        

  {/******************  rating  ************************* */}
  
      <article 
          className={`rating filter-section 
          ${customStringIncludes(visibleSection,'rating') ? 'drop-dowen' : 'pull-up'}
        `}>
        <div className='filter-header'>
          <h3>Ratings</h3>
          <button onClick={()=>toggleArrowDrop('rating')}>
            <DropArrow  list={visibleSection} item='rating'/>
          </button>
        </div>

        <div className='filter-body'>
          <button className="clear pt-1" onClick={_=> handleRemoveFilter('avgRating')}>
            <FontAwesomeIcon icon={faTrashCan} />
              <span>remove filter</span> 
          </button>

          <label className="flex no-check-shape mb-3">
            <input
              onChange={handleFilterRating}
              type="checkbox"
              id="equal-bigger-5"
              name="avgRating"
              value="5"
              data-values={ratingValues}
              ref={(el:any) => (ref_ratingEls.current[5] = el)}
            />
            <span>
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
            </span>
          </label>
  
          <label className="flex no-check-shape mb-3">
            <input
              onChange={handleFilterRating}
              type="checkbox"
              id="equal-bigger-4"
              name="avgRating"
              value="4"
              data-values={ratingValues}
              ref={(el:any) => (ref_ratingEls.current[4] = el)}
            />
            <span> 
              <FontAwesomeIcon icon={faStar}  />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} className='empty'/>
            </span>
          </label>
  
          <label className="flex no-check-shape mb-3">
            <input
              onChange={handleFilterRating}
              type="checkbox"
              id="equal-bigger-3"
              name="avgRating"
              value="3"
              data-values={ratingValues}
              ref={(el:any) => (ref_ratingEls.current[3] = el)}
            />
            <span> 
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} className='empty' />
              <FontAwesomeIcon icon={faStar} className='empty' />
            </span>
          </label>
  
          <label className="flex no-check-shape mb-3">
            <input
              onChange={handleFilterRating}
              type="checkbox"
              id="equal-bigger-2"
              name="avgRating"
              value="2"
              data-values={ratingValues}
              ref={(el:any) => (ref_ratingEls.current[2] = el)}
            />
            <span> 
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} className='empty' />
              <FontAwesomeIcon icon={faStar} className='empty' />
              <FontAwesomeIcon icon={faStar} className='empty' />
            </span>
          </label>
        </div> 

        <div className='filter-footer'></div> 
      </article>

    </aside>
  )
}

export default FilterSidebar