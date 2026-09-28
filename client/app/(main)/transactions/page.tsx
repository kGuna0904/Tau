'use client';

import { useState, useEffect } from "react";

export default function LoadPage() {
    
    const [rows, setRows] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState<any>('');
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');//state of the search box
    const [search, setSearch] = useState('');//actual state the search holds

    useEffect(() => {
        //timer set once the search takes place
        const timer = setTimeout(() => {
            //page 1, setting the search to the search input
            setSearch(searchInput);
            setPage(1);
        }, 300);
        
        //returns clearing the search box/input once the set timeout is past 300
        return () => clearTimeout(timer);
    }, [searchInput]);

    //async to load the data from the fetch to the rows and total, hence the loading state being false
    useEffect(() => {
        async function load() {
            setLoading(true);
            const res = await fetch(`/api/me/transactions?type=${type}&page=${page}&limit=15&search=${search}`);
            const data = await res.json();
            setRows(data.rows);
            setTotal(data.total);
            setLoading(false);
        }
        //func needs to run atleast once 
        load();
    }, [type, page, loading]);//depends on these



    return (
        <div className="flex flex-col pb-4">
            <h1 className="font-display text-3xl mb-2">Dashboard</h1>
            <h3 className="font-display  mb-5">View and manage all your transactions.</h3>
            
        </div>
    );

    
}