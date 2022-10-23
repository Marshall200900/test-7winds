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
    sendItem: (data: HierarchyData, parent: HierarchyData | null, originalItem: HierarchyData) => void,
    editItem: (data: HierarchyData) => void,
    deleteItem: (data: HierarchyData, parent: HierarchyData | null) => Promise<void>,
    parentNode: HierarchyData | null,
}

interface ImageProps {
    onClick?: () => void,
    className: string,
    id: string,
    src: string, 
}

interface InputProps {
    onInput: (v: string | number) => void,
    value: string | number,
    onKeyUp: (ev: React.KeyboardEvent) => void,
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

const Input: React.FC<InputProps> = ({ 
    onInput,
    value,
    onKeyUp,
 }) => {
    return (
        <input 
            onInput={(e) => onInput(e.currentTarget.value)}
            onClick={(el) => el.stopPropagation()}
            value={value}
            onKeyUp={onKeyUp}
            placeholder={value.toString()}
            className="Table__Input"
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
    editItem,
    deleteItem,
}) => {
    const [rowNameInput, setRowNameInput] = useState(data.rowName);
    const [salaryInput, setSalaryInput] = useState(data.salary);
    const [equipmentCostsInput, setEquipmentCostsInput] = useState(data.equipmentCosts);
    const [overheadsInput, setOverheadsInput] = useState(data.overheads);
    const [estimatedProfitInput, setEstimatedProfitInput] = useState(data.estimatedProfit);

    useEffect(() => {
        setRowNameInput(data.rowName);
        setSalaryInput(data.salary);
        setEquipmentCostsInput(data.equipmentCosts)
        setOverheadsInput(data.overheads)
        setEstimatedProfitInput(data.estimatedProfit)
    }, [data.temp]);

    const event = (ev: React.KeyboardEvent) => {
        if (ev.key === 'Enter') {
            sendItem(createItem({
                parentId: parentNode?.id || null,
                id: data.id,
                parentNode,
                rowName: rowNameInput,
                salary: salaryInput,
                equipmentCosts: equipmentCostsInput,
                overheads: overheadsInput,
                estimatedProfit: estimatedProfitInput,
            }), parentNode, data);
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
                <td className="Table__Data">
                    <Input
                        onInput={(v) => setRowNameInput(v as string)}
                        value={rowNameInput}
                        onKeyUp={event}
                    />
                </td>
                <td className="Table__Data">
                    <Input
                        onInput={(v) => setSalaryInput(v as number)}
                        value={salaryInput}
                        onKeyUp={event}
                    />
                </td>
                <td className="Table__Data">
                    <Input
                        onInput={(v) => setEquipmentCostsInput(v as number)}
                        value={equipmentCostsInput}
                        onKeyUp={event}
                    />
                </td>
                <td className="Table__Data">
                    <Input
                        onInput={(v) => setOverheadsInput(v as number)}
                        value={overheadsInput}
                        onKeyUp={event}
                    />
                </td>
                <td className="Table__Data">
                    <Input
                        onInput={(v) => setEstimatedProfitInput(v as number)}
                        value={estimatedProfitInput}
                        onKeyUp={event}
                    />
                </td>
            </tr>
        )
    }

    const formatter = new Intl.NumberFormat('fr-FR');
    
    return (
        <>
            <tr onClick={(el) => el.stopPropagation()} onDoubleClick={(e) => editItem(data)} className="Table__Row">
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
                <td className="Table__Data">{formatter.format(data.salary)}</td>
                <td className="Table__Data">{formatter.format(data.equipmentCosts)}</td>
                <td className="Table__Data">{formatter.format(data.overheads)}</td>
                <td className="Table__Data">{formatter.format(data.estimatedProfit)}</td>
            </tr>
        </>
    )
}