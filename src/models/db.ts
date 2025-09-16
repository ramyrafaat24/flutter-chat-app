import {Pool} from 'pg';

const pool = new Pool({
    user: 'postgres',
    password:'1996',
    host: 'localhost',
    port: 5432,
    database:'chat',

})
export default pool;