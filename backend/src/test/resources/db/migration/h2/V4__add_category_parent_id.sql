alter table categories
  add column parent_id bigint references categories(id);

create index idx_categories_user_parent
  on categories(user_id, parent_id);
