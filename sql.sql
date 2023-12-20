create table cccat14.ride (
    ride_id uuid primary key,
    passenger_id uuid,
    driver_id uuid,
    fare numeric,
    distance numeric,
    status text,
    from_lat numeric,
    from_long numeric,
    to_lat numeric,
    to_long numeric,
    last_lat numeric,
    last_long numeric,
    created_at timestamp,
    updated_at timestamp
);

create table cccat14.position (
    position_id uuid primary key,
    ride_id uuid,
    lat numeric,
    long numeric,
    created_at timestamp,
);

create table cccat14.transaction (
    transaction_id uuid primary key,
    ride_id uuid,
    amount numeric,
    status text,
    date timestamp,
);