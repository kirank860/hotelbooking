import React from 'react'

const Title = ({ title, subTitle, align = "center", font }) => {
  return (
    <div
      className={`flex flex-col ${
        align === "left"
          ? "items-start text-left"
          : "items-center text-center"
      }`}
    >
      <h1 className={`text-3xl md:text-[40px] font-semibold ${font || "font-playfair"}`}>
        {title}
      </h1>
      <p className="text-sm md:text-base text-gray-500 mt-3 max-w-[700px] leading-relaxed">
        {subTitle}
      </p>
    </div>
  )
}

export default Title
