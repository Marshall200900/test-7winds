import Folder1 from '../../assets/folder1.svg';
import Folder2 from '../../assets/folder2.svg';
import File from '../../assets/file.svg';
import GarbageBin from '../../assets/garbage-bin.svg';
import { createItem, HierarchyData } from '../Hierarchy/Hierarchy';

import './HierItem.scss';
import React, { useEffect, useState } from 'react';

interface HierItemProps {
    data: HierarchyData,
    id: string,
    level: number,
    addItem: (item: HierarchyData | null) => void,
    sendItem: (data: HierarchyData, parent: HierarchyData | null) => void,
    deleteItem: (data: HierarchyData, parent: HierarchyData | null) => Promise<void>,
    parentNode: HierarchyData | null,
}

interface ImageProps {
    onClick?: () => void,
    className: string,
    id: string,
    src: string, 
}

const Image: React.FC<ImageProps> = ({ className, id, src, onClick }) => {
    return (
        <img
            onClick={onClick && onClick}
            id={id}
            className={`Table__Icon ` + className}
            src={src}
            alt="folder"
        />
    )
}

export const HierItem: React.FC<HierItemProps> = ({ 
    data,
    id,
    addItem,
    sendItem,
    level = 0,
    parentNode,
    deleteItem,
}) => {
    const [rowNameInput, setRowNameInput] = useState('');
    const [salaryInput, setSalaryInput] = useState(0);
    const [equipmentCostsInput, setEquipmentCostsInput] = useState(0);
    const [overheadsInput, setOverheadsInput] = useState(0);
    const [estimatedProfitInput, setEstimatedProfitInput] = useState(0);

    const event = (ev: React.KeyboardEvent) => {
        if (ev.key === 'Enter') {
            console.log(parentNode?.id);
            sendItem(createItem({
                parentId: parentNode?.id || null,
                parentNode,
                rowName: rowNameInput,
                salary: salaryInput,
                equipmentCosts: equipmentCostsInput,
                overheads: overheadsInput,
                estimatedProfit: estimatedProfitInput,
            }), parentNode);
        }
    };
    
    const src = level === 0 ? Folder1 : data.child?.length ? Folder2 : File;
    
    const addChild = () => {
        addItem(data);
    }
    
    const addSibling = () => {
        addItem(parentNode);
        
    }
    
    const func = level === 0 ? addSibling : addChild;

    const imgList = [
        <Image onClick={() => deleteItem(data, parentNode)}  key={0} src={GarbageBin} id={id + 'delete'} className="Table__IconSecondary" />
    ];
    if (data.child?.length) {
        imgList.unshift(<Image key={1} src={File} id={id + 'file'} className="Table__IconSecondary" />)
    }
    if (level === 0) {
        imgList.unshift(<Image onClick={addChild} key={2} src={Folder2} id={id + 'folder2'} className="Table__IconSecondary" />)
    }

    const onInput = (e: React.FormEvent<HTMLInputElement>, callback: React.Dispatch<React.SetStateAction<number>>) => {
        const parsed = parseInt(e.currentTarget.value);
        callback(parsed);
    }

    if (data.temp) {
        return (
            <tr>
                <td style={{ minWidth: 34 * (level + 1) + 60 }} className="Table__Data Table__DataFirst">
                    <div
                        style={{ marginLeft: 26 * level }}
                        className="Hierarchy__ImgGroup">
                        <img id={id} className="Table__Icon" src={File} alt="folder" />
                        {imgList}
                    </div>
                </td>
                <td className="Table__Data">
                    <input onInput={(e) => setRowNameInput(e.currentTarget.value)} value={rowNameInput} onKeyUp={event} placeholder="" className="Table__Input" />
                </td>
                <td className="Table__Data">
                    <input onInput={(e) => onInput(e, setSalaryInput)} value={salaryInput} onKeyUp={event} placeholder="0" className="Table__Input" />
                </td>
                <td className="Table__Data">
                    <input onInput={(e) => onInput(e, setEquipmentCostsInput)} value={equipmentCostsInput} onKeyUp={event} placeholder="0" className="Table__Input" />
                </td>
                <td className="Table__Data">
                    <input onInput={(e) => onInput(e, setOverheadsInput)} value={overheadsInput} onKeyUp={event} placeholder="0" className="Table__Input" />
                </td>
                <td className="Table__Data">
                    <input onInput={(e) => onInput(e, setEstimatedProfitInput)} value={estimatedProfitInput} onKeyUp={event} placeholder="0" className="Table__Input" />
                </td>
            </tr>
        )
    }
    
    return (
        <>
            <tr className="Table__Row">
                <td className="Table__Data Table__DataFirst" style={{ minWidth: 34 * (level + 1) + 60 }}>
                    <div
                        style={{ marginLeft: 26 * level }}
                        className="Hierarchy__ImgGroup">
                        <img
                            onClick={func}
                            id={id}
                            className="Table__Icon"
                            src={src}
                            alt="folder"
                        />
                        {imgList}
                    </div>
                </td>
                <td className="Table__Data">{data.rowName}</td>
                <td className="Table__Data">{data.salary}</td>
                <td className="Table__Data">{data.equipmentCosts}</td>
                <td className="Table__Data">{data.overheads}</td>
                <td className="Table__Data">{data.estimatedProfit}</td>
            </tr>
        </>
    )
}