import React, { useState, useContext } from 'react';
import { Card, CardBody, CardTitle, CardText, Col } from 'reactstrap';
import { settingsContext } from '../Providers/SettingsProvider';

const ShiftBox = (props) => {

    const settings = useContext(settingsContext);

    const setShifts = () => {
        settings.changeSettings(props.shiftInfo.shift_id);

    }

    return (
        <Card
            className={(settings.shid && settings.shid.includes(props.shiftInfo.shift_id)) ? 'my-2 shift-sett' : 'my-2 '}
            onClick={setShifts}
        >
            <CardBody>
                <CardTitle>
                    {props.shiftInfo.facility_name}
                </CardTitle>
                <CardText>
                    <Col>
                        <div>
                            {props.shiftInfo.shift_date.toString().slice(0, 10)}
                        </div>
                        <div>
                            {props.shiftInfo.start_time} - {props.shiftInfo.end_time}
                        </div>
                    </Col>
                </CardText>
            </CardBody>
        </Card>
    );
}

export default ShiftBox;