import { useEffect, useState } from 'react';
import Folder1 from '../../assets/folder1.svg';
import Folder2 from '../../assets/folder2.svg';
import File from '../../assets/file.svg';
import { Hierarchy } from '../Hierarchy/Hierarchy';

import './Table.scss';


export const Table = () => {
    return (
        <table className="Table">
            <thead className="Table__Head">
                <tr className="Table__Row">
                    <th className="Table__Level">Уровень</th>
                    <th className="Table__Name">Наименование работ</th>
                    <th>Основная з/п</th>
                    <th>Оборудование</th>
                    <th>Накладные расходы</th>
                    <th>Сметная прибыль</th>
                </tr>
            </thead>
            <tbody className="Table__Body">
                <Hierarchy />
            </tbody>
        </table>
    )
};