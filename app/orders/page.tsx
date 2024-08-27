import DetailsMayLike from "@/components/details/DetailsMayLike"
import SavedForLater from "@/components/general/SavedForLater"
import Header from "@/components/layout/Header"
import ProgressNav from "@/components/layout/ProgressNav"
import MenuSidebar from "@/components/layout/menu-sidebar"
import OrderResult from "@/components/orders/OrderResult"

const page = () => {

    return <>
    <Header page='details' heading='Item detailes' /> 
    <MenuSidebar />
    <div className="orders-page">
      <div className="container">
        <ProgressNav page='orders' category='no category' item='no item'/>
        <div className="orders-wrapper">
          <OrderResult />
          <div className="may-like">
            <DetailsMayLike />
          </div>
        </div>
      </div>
      <SavedForLater />
    </div>
    </>
}

export default page