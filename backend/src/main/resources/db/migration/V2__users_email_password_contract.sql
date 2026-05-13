alter table users add column email varchar(120);

update users set email = username where email is null;

alter table users alter column email set not null;

alter table users rename column password_hash to password;

drop index if exists uk_users_username_active;

create unique index uk_users_email_active on users (email) where deleted_at is null;
