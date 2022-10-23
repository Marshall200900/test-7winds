import React, { useEffect, useState } from 'react';
import { HierItem } from '../HierItem/HierItem';
import 'jquery-connections';

import './Hierarchy.scss';

const BASE_URL = 'http://185.244.172.108:8081/v1/outlay-rows/entity/';
const eID = '22';

export interface HierarchyData {
    id?: number,
    parentNode: HierarchyData | null,
    parentId?: number | null,
    rowName: string,
    total: number,
    salary: number,
    mimExploitation: number,
    machineOperatorSalary: number,
    materials: number,
    mainCosts: number,
    supportCosts: number,
    equipmentCosts: number,
    overheads: number,
    estimatedProfit: number,
    child: HierarchyData[],
    temp?: boolean,
}

export const createItem = (item: object): HierarchyData => {
    const hierBase: HierarchyData = {
        parentId: null,
        parentNode: null,
        id: 0,
        rowName: "",
        total: 0,
        salary: 0,
        mimExploitation: 0,
        machineOperatorSalary: 0,
        materials: 0,
        mainCosts: 0,
        supportCosts: 0,
        equipmentCosts: 0,
        overheads: 0,
        estimatedProfit: 0,
        child: [],
    }
    return { ...hierBase, ...item };
}

let elementsPair: string[][] = [];

const getId = (parentStrId: string, idx: number) => {
    let id;
    if (parentStrId !== '') {
        elementsPair.push([parentStrId, `${parentStrId}${idx}`])
        id = `${parentStrId}${idx}`;
    } else {
        id = `folder${idx}`;
    }
    return id;
}

const fetchedData = async () => {
    const res = await fetch(`${BASE_URL}${eID}/row/list`);
    if (res.ok) {
        return res.json();
    }
    return [];
}

const createLines = () => {
    // for some reason jquery-connections does not work okay when immediately called
    const elements = document.querySelectorAll('.connection');
    for(let el of elements) {
        el.remove();
    }
    setTimeout(() => {
        elementsPair.forEach(el => {
            // @ts-ignore
            $(`#${el[0]}`).connections({ to: `#${el[1]}` , css: {
                border: '1px solid #C6C6C6',
                'pointer-events': 'none',
            }});
        });
        elementsPair = [];
    }, 10);
}

export const Hierarchy = () => {

    const [data, setData] = useState<HierarchyData[]>([]);
    const [init, setInit] = useState(false);
    const [creating, setCreating] = useState<HierarchyData | undefined>();
    const [editing, setEditing] = useState<HierarchyData | undefined>();

    const evtClickDoc = () => {
        if(creating) {
            removeTemp();
            setCreating(undefined);
        } else if (editing) {
            editing.temp = false;
            setEditing(undefined);
        }
    };

    useEffect(() => {
        (async () => {
            const data = await fetchedData();
            setData(data);
            setInit(true);
        })();
    }, []);

    useEffect(() => {
        createLines();
        if (!data.length && init) {
            const newItem = createItem({
                temp: true,
            });
            data.push(newItem);
            setCreating(newItem);
        }
    }, [data]);

    useEffect(() => {
        elementsPair.forEach(el => {
            // @ts-ignore
            $(`#${el[0]}`).connections("update");
        })
        const clear = () => {
            evtClickDoc();
            setData([...data]);
        };
        document.addEventListener('click', clear);
        return () => {
            document.removeEventListener('click', clear);
        }
    });

    const removeTemp = () => {
        if (creating) {
            if (creating.parentNode === null) {
                data.splice(data.indexOf(creating), 1);
            } else {
                const parent = creating.parentNode;
                parent.child?.splice(parent.child.indexOf(creating), 1);
            }
        }
        if (editing) {
            let item;
            if (editing.parentNode === null) {
                item = data.find(el => el.id === editing.id);
                data.splice(data.indexOf(editing), 1);
            } else {
                const parent = editing.parentNode;
                item = parent.child?.find(el => el.id === editing.id);
            }
            if (item) {
                item.temp = false;
            }
        }
    }

    const addItem = (parentNode: HierarchyData | null) => {
        evtClickDoc();
        if (parentNode) {
            const newItem = createItem({
                parentId: parentNode.id,
                parentNode,
                temp: true,
            });
            parentNode.child?.push(newItem);
            setCreating(newItem);
        } else {
            const newItem = createItem({
                temp: true,
                parentNode: null
            });
            data.push(newItem);
            setCreating(newItem);
        }
        setData([...data]);
    }

    const deleteItem = async (item: HierarchyData, parentNode: HierarchyData | null) => {
        const res = await fetch(`${BASE_URL}${eID}/row/${item.id}/delete`, {
            method: 'DELETE'
        });
        if (res.ok) {
            if(parentNode) {
                parentNode.child = parentNode.child?.filter(el => el.id !== item.id);
                setData([...data]);
            } else {
                let newData = data;
                newData = data.filter(el => el.id !== item.id);
                setData([...newData]);
            }
        }
    }

    const sendItem = async (item: HierarchyData, originalItem: HierarchyData) => {
        if(editing) {
            submitEdit(item, originalItem);
        } else {
            submitSend(item);
        }
    }

    const editItem = (item: HierarchyData) => {
        evtClickDoc();
        item.temp = true;
        setEditing(item);
        setData([...data]);
    }

    const submitEdit = async (item: HierarchyData, originalItem: HierarchyData) => {
        const itemToSend = { ...item, parentNode: null };
        const res = await fetch(`${BASE_URL}${eID}/row/${originalItem.id}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemToSend),
        });
        if(res.ok) {
            const newItem: { current: HierarchyData } = await res.json();
            originalItem.rowName = newItem.current.rowName;
            originalItem.salary = newItem.current.salary;
            originalItem.equipmentCosts = newItem.current.equipmentCosts;
            originalItem.overheads = newItem.current.overheads;
            originalItem.estimatedProfit = newItem.current.estimatedProfit;
            originalItem.temp = false;
            setData([...data]);
            setCreating(undefined);
        }
    }

    const submitSend = async (item: HierarchyData) => {
        const itemToSend = { ...item, parentNode: null };
        const res = await fetch(`${BASE_URL}${eID}/row/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemToSend),
        });
        if (res.ok) {
            const newItem: { current: { id: number } } = await res.json();
            item.id = newItem.current.id;
            if (item.parentNode) {
                item.parentNode.child?.push(item);
            } else {
                data.push(item);
            }
            removeTemp();
            setData([...data]);
            setCreating(undefined);

        }
    }

    const renderItems = (data: HierarchyData, idx: number, parentIdx: string, level = 0, parentNode: HierarchyData | null = null): JSX.Element => {
        const id = getId(parentIdx, idx);
        data.parentNode = parentNode;
        return (
            <React.Fragment key={data.id}>
                <HierItem
                    data={data}
                    id={id}
                    level={level}
                    addItem={addItem}
                    sendItem={sendItem}
                    deleteItem={deleteItem}
                    editItem={editItem}
                />
                {data.child?.map((row, idx) => {
                    return renderItems(row, idx, id,  level + 1, data || null)
                })}
            </React.Fragment>
        )
    }
    return data.map((el, idx) => renderItems(el, idx, ''))
}