import React, { useState, useContext } from 'react';
import { Row, Collapse, Card, CardBody, Button } from 'reactstrap';
import { settingsContext } from '../Providers/SettingsProvider';

const CompareBox = (props) => {
    const settings = useContext(settingsContext);
    const [comp, setComp] = useState({});

    const compareShifts = async () => {
        return await fetch('http://localhost:3030/compareShifts',
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(settings)
            }).then((rawData) => rawData.json()).then((shifts) => {
                setComp(shifts);
            });
    }

    return (
        <Row className='comparebox'>
            <Card>
                <CardBody>
                    {comp && comp.maxOverlap !== undefined ? (
                        <ul>
                            <li>Max Overlap: {comp.maxOverlap}</li>
                            <li>Overlap Minutes: {comp.overlapMinutes}</li>
                            <li>Are they overlaping?: {comp.isOverlap? ' yes' : ' no'}</li>
                        </ul>
                    ): 'Compare between two selected shifts' }
                    
                </CardBody>
            </Card>
            <Button disabled={settings.shid.length < 2} onClick={compareShifts}> Compare </Button>
        </Row>

    );
}

export default CompareBox;