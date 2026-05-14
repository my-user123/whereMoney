alter table users
  add column is_new_user_first_login boolean not null default false;
