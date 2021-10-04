import { Toolbox, Rest } from './index';

const needle = require('needle');
/*
const body = {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHVzZXIiOjIzLCJsb2dpbiI6ImRhdGFkcml2ZSIsInBhc3N3b3JkIjoiJDJhJDEwJFZuL3pQQ004c1NTYVluUm1nZ1Y0Q09MbzJ0WVROdUgzUUNaNG9jMzNwMnBxbC9lQUNpd09lIiwiZW1haWwiOiJkYXRhZHJpdmVAc29sYXJkYXRhLnRlY2giLCJ0eXBlIjoxMDAsImNvdW50cnkiOiJGUiIsImxhc3RuYW1lIjoiZGF0YWRyaXZlIiwiZmlyc3RuYW1lIjoiZGF0YWRyaXZlIiwicGhvbmUxIjpudWxsLCJwaG9uZTIiOm51bGwsInBob25lMyI6bnVsbCwidGFnIjpudWxsLCJhdmFpbGFiaWxpdHkiOm51bGwsImxhbmd1YWdlIjpudWxsLCJvZmZpY2UiOm51bGwsInBvc3RhbGNvZGUiOm51bGwsImNpdHkiOm51bGwsImFkZHJlc3MxIjpudWxsLCJhZGRyZXNzMiI6bnVsbCwiYXBwbGljYXRpb24iOiJkYXRhZHJpdmUiLCJ2YWxpZGF0ZWQiOjEsIm9yZ2FuaXNhdGlvbiI6bnVsbCwiY3JlYXRpb25kYXRlIjoiMjAxOS0xMC0zMFQxODozNjowNC4wMDBaIiwidXBkYXRlZGF0ZSI6IjIwMTktMTAtMzBUMTg6MzY6MDQuMDAwWiIsInZhbGlkYXRpb25Db2RlIjpudWxsLCJ2YWxpZGF0aW9uRGF0ZSI6bnVsbCwiaWF0IjoxNTcyNTEzMjA4fQ.KJ1RZ4yHQp5dSk9CpL88l0c1xLJnlupPolTpCfus08g",
    "identifier": "budensmsivirtual"
};
*/
const body = null;

let r = new Rest();

r.call((data: any, err: any)=>{
    console.log("err", err);
    console.log("data", data);
}, "GET", 'https://www.solardata.eu/apifileserver2/', body)
