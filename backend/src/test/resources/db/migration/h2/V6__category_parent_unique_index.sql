drop index if exists uk_categories_user_name_type_active;

create unique index uk_categories_user_parent_name_type_active
  on categories(user_id, parent_id, name, type);
