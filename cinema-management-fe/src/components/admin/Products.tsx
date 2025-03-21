import { useState, ChangeEvent } from "react"
import Product from "./items/Product"
import SearchImg from "../../assets/images/search.svg"
import addImg from "../../assets/images/add.svg"
import { exampleProducts  } from "../../data"

const Products: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All")
  const [searchTerm, setSearchTerm] = useState<string>("")

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }

  const handleAddNewClick = () => {
    alert("Add New Btn clicked")
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredProducts = exampleProducts.filter((product) => {
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Others"
        ? product.type !== "Food and Drinks" && product.type !== "Souvenirs"
        : product.type === activeTab)
    const searchTermLower = searchTerm.toLowerCase()
    const matchesSearch =
      (product.name && product.name.toLowerCase().includes(searchTermLower)) ||
      (product.description && product.description.toLowerCase().includes(searchTermLower)) ||
      (product.type && product.type.toLowerCase().includes(searchTermLower)) ||
      (product.price && product.price.toString().includes(searchTermLower))
    return matchesTab && matchesSearch
  })

  return (
    <div className="products flex flex-col h-[673px] overflow-y-visible scrollbar-hide relative">
      <div className="text-40px font-medium text-dark-gray">Products</div>
      <div className="flex items-center mt-2">
        <div className="SearchBar relative w-full max-w-[240px] h-8">
          <input
            type="text"
            className="size-full pl-10 pr-5 text-sm text-dark-gray rounded-full text-gray-700 bg-white border-line-gray border-2 focus:outline-none focus:ring-1"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <img
            src={SearchImg}
            alt="Search"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
          />
        </div>
      </div>
      <div className="product-tabs flex mt-4 z-20 text-light-gray">
        <button
          className={`tab ${activeTab === "All" ? "active" : ""}`}
          onClick={() => handleTabClick("All")}
        >
          <span>All</span>
        </button>
        <button
          className={`tab ${activeTab === "Food and Drinks" ? "active" : ""}`}
          onClick={() => handleTabClick("Food and Drinks")}
        >
          <span>Food and Drinks</span>
        </button>
        <button
          className={`tab ${activeTab === "Souvenirs" ? "active" : ""}`}
          onClick={() => handleTabClick("Souvenirs")}
        >
          <span>Souvenirs</span>
        </button>
        <button
          className={`tab ${activeTab === "Others" ? "active" : ""}`}
          onClick={() => handleTabClick("Others")}
        >
          <span>Others</span>
        </button>
        
      </div>
      <div className="relative -mt-[2px] min-w-[360px] sm:min-w-[680px] w-full h-full bg-white border-[2px] border-light-gray rounded-b-xl rounded-tr-xl rounded-tl-none pl-12 py-6 pr-4">
        <div className="list grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 max-h-[510px] py-3 overflow-y-auto overflow-x-clip">
          {filteredProducts.map((product, index) => (
            <Product key={index} {...product} />
          ))}
        </div>
        <button
          className="absolute bottom-6 right-9 size-11 rounded-2xl bg-red hover:bg-dark-red duration-200 z-20"
          onClick={handleAddNewClick}
        >
          <img className="size-11 invert brightness-0" src={addImg} alt="Add New" />
        </button>
      </div>
    </div>
  )
}

export default Products