create table users (
  id bigint primary key,
  username varchar(64) not null,
  password_hash varchar(255) not null,
  status varchar(32) not null,
  last_login_at timestamp,
  created_at timestamp not null,
  updated_at timestamp not null,
  deleted_at timestamp
);

create unique index uk_users_username_active on users (username) where deleted_at is null;

create table user_profiles (
  id bigint primary key,
  user_id bigint not null references users(id),
  nickname varchar(64) not null,
  avatar_url varchar(512),
  default_currency varchar(3) not null,
  user_type varchar(64),
  timezone varchar(64) not null,
  created_at timestamp not null,
  updated_at timestamp not null
);

create unique index uk_user_profiles_user_id on user_profiles(user_id);

create table accounts (
  id bigint primary key,
  user_id bigint not null references users(id),
  name varchar(64) not null,
  type varchar(32) not null,
  currency varchar(3) not null,
  initial_balance numeric(18, 2) not null,
  current_balance numeric(18, 2) not null,
  color varchar(32),
  icon varchar(64),
  sort_order integer not null default 0,
  status varchar(32) not null,
  created_at timestamp not null,
  updated_at timestamp not null,
  deleted_at timestamp
);

create index idx_accounts_user_status on accounts(user_id, status);
create unique index uk_accounts_user_name_active on accounts(user_id, name) where deleted_at is null;

create table categories (
  id bigint primary key,
  user_id bigint references users(id),
  name varchar(64) not null,
  type varchar(32) not null,
  icon varchar(64),
  color varchar(32),
  is_system boolean not null default false,
  sort_order integer not null default 0,
  status varchar(32) not null,
  created_at timestamp not null,
  updated_at timestamp not null,
  deleted_at timestamp
);

create index idx_categories_user_type_status on categories(user_id, type, status);
create unique index uk_categories_user_name_type_active
  on categories(user_id, name, type) where deleted_at is null;

create table transactions (
  id bigint primary key,
  user_id bigint not null references users(id),
  account_id bigint not null references accounts(id),
  category_id bigint not null references categories(id),
  type varchar(32) not null,
  amount numeric(18, 2) not null,
  currency varchar(3) not null,
  occurred_at timestamp not null,
  note varchar(500),
  source varchar(32) not null,
  source_ref_id bigint,
  created_at timestamp not null,
  updated_at timestamp not null,
  deleted_at timestamp,
  constraint ck_transactions_amount_positive check (amount > 0)
);

create index idx_transactions_user_occurred on transactions(user_id, occurred_at);
create index idx_transactions_user_category_occurred on transactions(user_id, category_id, occurred_at);
create index idx_transactions_user_account_occurred on transactions(user_id, account_id, occurred_at);
create index idx_transactions_user_type_occurred on transactions(user_id, type, occurred_at);
create index idx_transactions_user_currency_occurred on transactions(user_id, currency, occurred_at);
