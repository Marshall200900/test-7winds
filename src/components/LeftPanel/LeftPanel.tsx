import React from 'react';
import Arrow from '../../assets/arrow-down.svg';
import Square from '../../assets/weird-square.svg';
import './LeftPanel.scss';

const names = [
    'По проекту',
    'Объекты',
    'РД',
    'МТО',
    'СМР',
    'График',
    'МиМ',
    'Рабочие',
    'Капвложения',
    'Бюджет',
    'Финансирование',
    'Панорамы',
    'Камеры',
    'Поручения',
    'Контрагенты'
]

export const LeftPanel = () => {
    return (
        <div className="LeftPanel">
            <div className="LeftPanel__Collapse">
                <div className="LeftPanel__Titles">
                    <span className="LeftPanel__Name">Название проекта</span>
                    <span className="LeftPanel__Abbr">Аббревиатура</span>
                </div>
                <img src={Arrow} className="LeftPanel__Image" />
            </div>
            <div className="LeftPanel__Content">
                {names.map((name, idx) => (
                    <div key={idx} className="LeftPanel__Item">
                        <img src={Square} alt="weird square" className="LeftPanel__ItemImage" />
                        <span className="LeftPanel__ItemText">{name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}