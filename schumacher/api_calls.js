"use strict"

// API urls
export const navDepartments = [
  {departmentName: 'Fabrics', departmentNameFormatted: 'fabric'},
  {departmentName: 'Wallpaper', departmentNameFormatted: 'wallpaper'},
  {departmentName: 'Trim', departmentNameFormatted: 'trim'},
  {departmentName: 'Furniture', departmentNameFormatted: 'furniture'}
]

export const navFilterCategories = [
  { categoryFormatted: "Color",
    category: "ColorFamily",
    url: "//104.130.216.8/v8.1/api/Filter/GetColorFamilyFilter"
  },
  { categoryFormatted: "Style",
    category: "Style",
    url: "//104.130.216.8/v8.1/api/Filter/GetStyleFilter"
  },
  { categoryFormatted: "Type",
    category: "Type",
    url: "//104.130.216.8/v8.1/api/Filter/GetTypeFilter"
  }
]
