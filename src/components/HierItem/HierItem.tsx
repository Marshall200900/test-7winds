import Folder1 from '../../assets/folder1.svg';
import Folder2 from '../../assets/folder2.svg';
import File from '../../assets/file.svg';
import GarbageBin from '../../assets/garbage-bin.svg';
import { createItem, HierarchyData } from '../Hierarchy/Hierarchy';
import React, { useCallback, useEffect, useState } from 'react';

import './HierItem.scss';

interface HierItemProps {
    data: HierarchyData,
    id: string,
    level: number,
    addItem: (item: HierarchyData | null) => void,
    sendItem: (data: HierarchyData, originalItem: HierarchyData) => void,
    editItem: (data: HierarchyData) => void,
    deleteItem: (data: HierarchyData, parent: HierarchyData | null) => Promise<void>,
}

interface ImageProps {
    onClick?: () => void,
    className: string,
    id?: string,
    src: string, 
}

interface InputProps {
    onInput: (v: string | number) => void,
    value: string | number,
    onKeyUp: (ev: React.KeyboardEvent) => void,
}

type InputType = (v: string | number) => void;

const Image: React.FC<ImageProps> = React.memo(({ className, id, src, onClick }) => {
    const click = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onClick && onClick();
    }, [onClick]);

    return (
        <img
            onClick={click}
            id={id && id}
            className={`Table__Icon ` + className}
            src={src}
            alt="folder"
        />
    )
});

const Input: React.FC<InputProps> = React.memo(({ 
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
});
export const HierItem: React.FC<HierItemProps> = React.memo(({ 
    data,
    id,
    addItem,
    sendItem,
    level = 0,
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
                parentId: data.parentNode?.id || null,
                id: data.id,
                parentNode: data.parentNode,
                rowName: rowNameInput,
                salary: salaryInput,
                equipmentCosts: equipmentCostsInput,
                overheads: overheadsInput,
                estimatedProfit: estimatedProfitInput,
            }), data);
        }
    };
    
    const src = level === 0 ? Folder1 : data.child?.length ? Folder2 : File;
    
    const stopPropagation = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    const editItemHandler = useCallback(() => {
        editItem(data);
    }, [editItem, data]);
        
    const addChild = useCallback(() => {
        addItem(data);
    }, [addItem, data]);

    const add = useCallback(() => {
        if (level === 0) {
            addItem(data.parentNode);
        } else {
            addItem(data);
        }
    }, [addItem, data]);

    const imgList = [
        <Image
            onClick={() => deleteItem(data, data.parentNode)}
            key={0}
            src={GarbageBin}
            className="Table__IconSecondary"
        />];

    if (data.child?.length) {
        imgList.unshift(
            <Image
                key={1}
                src={File}
                className="Table__IconSecondary"
            />)
    }

    if (level === 0) {
        imgList.unshift(
            <Image
                onClick={addChild}
                key={2}
                src={Folder2}
                className="Table__IconSecondary"
            />)
    }

    imgList.unshift(
        <Image
            onClick={add}
            key={3}
            src={src}
            id={id}
            className="Table__Icon"
        />)

    if (data.temp) {
        return (
            <tr>
                <td style={{ minWidth: 34 * (level + 1) + 60 }} className="Table__Data Table__DataFirst">
                    <div
                        style={{ marginLeft: 26 * level }}
                        className="Hierarchy__ImgGroup">
                        {imgList}
                    </div>
                </td>
                <td className="Table__Data">
                    <Input
                        onInput={setRowNameInput as InputType}
                        value={rowNameInput}
                        onKeyUp={event}
                    />
                </td>
                <td className="Table__Data">
                    <Input
                        onInput={setSalaryInput as InputType}
                        value={salaryInput}
                        onKeyUp={event}
                    />
                </td>
                <td className="Table__Data">
                    <Input
                        onInput={setEquipmentCostsInput as InputType}
                        value={equipmentCostsInput}
                        onKeyUp={event}
                    />
                </td>
                <td className="Table__Data">
                    <Input
                        onInput={setOverheadsInput as InputType}
                        value={overheadsInput}
                        onKeyUp={event}
                    />
                </td>
                <td className="Table__Data">
                    <Input
                        onInput={setEstimatedProfitInput as InputType}
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
            <tr onClick={stopPropagation} onDoubleClick={editItemHandler} className="Table__Row">
                <td className="Table__Data Table__DataFirst" style={{ minWidth: 34 * (level + 1) + 60 }}>
                    <div
                        style={{ marginLeft: 26 * level }}
                        className="Hierarchy__ImgGroup">
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
});
