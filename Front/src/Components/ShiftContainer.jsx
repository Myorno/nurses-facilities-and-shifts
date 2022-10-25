import React, { useEffect, useState } from 'react';
import ShiftBox from './ShiftBox';
import CompareBox from './CompareBox';
import { Col, Input, Row, Button } from 'reactstrap';
import { SettingsProvider } from '../Providers/SettingsProvider';

const ShiftContainer = (props) => {
    const [shifts, setShifts] = useState([]);

    const getShifts = async () => {
        return await fetch('http://localhost:3030/getShifts').then((rawData) => rawData.json()).then((shifts) => {
            setShifts(shifts);
        });
    }

    const q4query = async () => {
        return await fetch('http://localhost:3030/q4query').then((rawData) => rawData.json()).then((shifts) => {
            console.log(shifts);
        });
    }

    const q5query = async () => {
        return await fetch('http://localhost:3030/q5query').then((rawData) => rawData.json()).then((shifts) => {
            console.log(shifts);
        });
    }

    const q6query = async () => {
        return await fetch('http://localhost:3030/q6query',
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({ nurseId: 1001 })
            }).then((rawData) => rawData.json()).then((shifts) => {
                console.log(shifts);
            });
    }

    useEffect(() => {
        getShifts()
    }, [])

    return (
        <SettingsProvider>
            <Col className='shift-cont'>
                <CompareBox></CompareBox>
                <Row className='shiftbox-cont'>
                    {
                        shifts.map((shift, i) => {
                            return (
                                <ShiftBox key={i} shiftInfo={shift}></ShiftBox>
                            )
                        })
                    }
                </Row>
                <Row className='button-cont'>
                    <Button onClick={q4query}>Execute Q4 Query</Button>
                    <Button onClick={q5query}>Execute Q5 Query</Button>
                    <Button onClick={q6query}>Execute Q6 Query</Button>
                </Row>
            </Col>
        </SettingsProvider>
    );
}

export default ShiftContainer;