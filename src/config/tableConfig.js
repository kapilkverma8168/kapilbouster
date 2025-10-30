const tableConfig = {
    'user-level': {
      id: 'id',
      name: 'user_level_name',
      date: 'createdAt',
      status: 'isActive',
    },
    'user-category': {
      id: 'id',
      name: 'main_category_name',
      date: 'createdAt',
      status: 'isActive',
    },
    'user-sub-category': {
      id: 'id',
      name: 'sub_category_name',
      date: 'createdAt',
      status: 'isActive',
      slug:'url_slug'
    },
  };
  
  export default tableConfig;