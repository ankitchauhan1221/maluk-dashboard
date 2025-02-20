export const baseurl = 'http://localhost:5000';

export const routes = {
  addProduct: '/api/products',
  login:'/api/auth/login',
  logout:'/api/auth/logout',
  getUsers:'/api/profile/all',
  getAddress:'/api/address',
  
  // Category/Subcategory //
  addCategory:'/api/categories/createcategory',
  addSubcategory:'/api/categories/createSubcategory',
  getCategories:'/api/categories/',
  getAllSubcategories:'/api/categories/getAllSubCategories/',
  editCategory: (id: number) => `/api/categories/editCategory/${id}`,
  editSubCategory: (id: number) => `/api/categories/editSubcategory/${id}`,
  deleteCategory: (id: number) => `/api/categories/${id}`,
  deleteSubCategory: (id: number) => `/api/categories/deleteSubcategory/${id}`,
  toggleCategoryStatus: (id: number) => `/api/categories/${id}/status`,
  toggleCustomerStatus: (id: string) => `/api/auth/status/${id}`, 
  toggleSubCategoryStatus: (id: number) => `/api/categories/${id}/subStatus`, 
  
  // Coupons //
  BASE: '/api/coupons',
  CREATE: '/api/coupons/add',
  UPDATE: '/api/coupons/:id',
  TOGGLE_STATUS: '/api/coupons/:id/status',
  DELETE: '/api/coupons/:id',

  // Product //
  GET: '/api/products',
  ADD: '/api/products/add',
  EDIT: '/api/products/:id',
  REMOVE: '/api/products/:id'
};

