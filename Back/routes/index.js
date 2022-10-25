const {
    Router
} = require('express');
const router = Router();

const {
    Pool
} = require('pg');
var moment = require('moment');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '',
    database: 'Interview',
    port: '5432'
});

const facilitiesSpots = async (req, res, next) => {
    let arrFacilities = [];

    const response = await pool.query(`SELECT * 
    FROM jobs
    JOIN nurse_hired_jobs ON nurse_hired_jobs.job_id = jobs.job_id
    JOIN nurses ON nurses.nurse_id = nurse_hired_jobs.nurse_id`);

    response.rows.forEach(job => {

        let facilities = arrFacilities.length > 0 ? arrFacilities.map((element) => {
            return element.facility_id
        }) : []
        let position = arrFacilities.length > 0 ? facilities.indexOf(job.facility_id) : -1;

        if (position < 0) {
            var totalNeeded = job.nurse_type_needed === job.nurse_type ? job.total_number_nurses_needed - 1 : job.total_number_nurses_needed;
            var jobProps = {
                facility_id: job.facility_id,
                jobs: [{
                    job_id: job.job_id,
                    nurse_type: job.nurse_type_needed,
                    total_needed: totalNeeded,
                }]
            };
            arrFacilities.push(jobProps)
        } else {
            var arrJobs = arrFacilities[position].jobs.map((element) => {
                return element.job_id
            });
            let jobPosition = arrJobs.indexOf(job.job_id);
            if (jobPosition < 0) {

                var totalNeeded = job.nurse_type_needed === job.nurse_type ? job.total_number_nurses_needed - 1 : job.total_number_nurses_needed;
                let newJob = {
                    job_id: job.job_id,
                    nurse_type: job.nurse_type_needed,
                    total_needed: totalNeeded,
                }
                arrFacilities[position].jobs.push(newJob)

            } else {

                var totalNeeded = arrFacilities[position].jobs[jobPosition].total_needed;
                totalNeeded = job.nurse_type_needed === job.nurse_type ? totalNeeded - 1 : totalNeeded;
                arrFacilities[position].jobs[jobPosition].total_needed = totalNeeded;

            }
        }

    })

    arrFacilities = arrFacilities.sort((a, b) => {
        return a.facility_id - b.facility_id;
    });

    arrFacilities.forEach((facility, i) => {
        arrFacilities[i].jobs = facility.jobs.sort((a, b) => {
            let fa = a.nurse_type.toLowerCase(),
                fb = b.nurse_type.toLowerCase();

            if (fa < fb) {
                return -1;
            }
            if (fa > fb) {
                return 1;
            }
            return 0;
        });
    });

    res.facilities = arrFacilities;
    next();
}

const getShifts = async (req, res) => {
    const response = await pool.query(`SELECT question_one_shifts.shift_id, facilities.facility_id, facilities.facility_name,question_one_shifts.shift_date, question_one_shifts.end_time, question_one_shifts.start_time
    FROM question_one_shifts JOIN facilities ON facilities.facility_id = question_one_shifts.facility_id
    `)
    res.status(200).json(response.rows);
}

const compareShifts = async (req, res) => {
    try {
        const response = await pool.query(`SELECT * FROM question_one_shifts WHERE shift_id=${req.body.shid[0]} or shift_id=${req.body.shid[1]}`)

        let overlap = {
            maxOverlap: 0,
            overlapMinutes: 0,
            isOverlap: false
        };

        let shift0 = response.rows[0];
        let shift1 = response.rows[1];


        if (shift0.facility_id === shift1.facility_id) {
            //    comparison logig should be here! 
            overlap = {
                maxOverlap: 30,
                overlapMinutes: 0,
                isOverlap: false
            };

        }

        res.status(200).json(overlap);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }

}

const getCoworkers = async (req, res) => {
    const response = await pool.query(`SELECT * 
    FROM nurses
    JOIN nurse_hired_jobs ON nurse_hired_jobs.nurse_id = nurses.nurse_id
	JOIN jobs ON jobs.job_id = nurse_hired_jobs.job_id`)

    let arrNurses = [];

    let arrCoworkers = [];

    response.rows.forEach(nurse => {

        let nurses = arrNurses.length > 0 ? arrNurses.map((element) => {
            return element.nurse_id
        }) : [];
        let nursePosition = arrNurses.length > 0 ? nurses.indexOf(nurse.nurse_id) : -1;

        if (nursePosition < 0) {
            var nurseProps = {
                nurse_id: nurse.nurse_id,
                nurse_name: nurse.nurse_name,
                facilities: [nurse.facility_id],

            };
            arrNurses.push(nurseProps)
        } else {
            arrNurses[nursePosition].facilities.push(nurse.facility_id)
        }
    });

    let selectedNurseCW = [];

    selectedNurseCW = arrNurses.filter(nurse => nurse.nurse_id == req.body.nurseId)[0]


    if (selectedNurseCW) {
        let notSelectedNurse = arrNurses.filter(nurse => nurse.nurse_id !== req.body.nurseId);
        notSelectedNurse.forEach((nurse) => {
            nurse.facilities.forEach((facility) => {
                if (selectedNurseCW.facilities.includes(facility))
                    arrCoworkers.push(nurse.nurse_name)
            })
        })

        let uniqueCoworkers = [...new Set(arrCoworkers)];
        res.status(200).json(uniqueCoworkers);
    } else {
        res.status(400).json({
            message: 'not found'
        });
    }

}
router.get('/getShifts', getShifts);

router.post('/compareShifts', compareShifts);

router.get('/q4query', facilitiesSpots, (req, res) => {
    res.status(200).json(res.facilities);
})

router.get('/q5query', facilitiesSpots, async (req, res) => {
    const response = await pool.query(`SELECT * 
    FROM nurses
    JOIN nurse_hired_jobs ON nurse_hired_jobs.nurse_id = nurses.nurse_id`);

    let arrNurses = []

    response.rows.forEach(nurse => {

        let nurses = arrNurses.length > 0 ? arrNurses.map((element) => {
            return element.nurse_id
        }) : [];
        let nursePosition = arrNurses.length > 0 ? nurses.indexOf(nurse.nurse_id) : -1;

        if (nursePosition < 0) {
            var nurseProps = {
                nurse_id: nurse.nurse_id,
                nurse_name: nurse.nurse_name,
                nurse_type: nurse.nurse_type,
                hired_now: [nurse.job_id],
                total_jobs_can_hired: 0

            };
            arrNurses.push(nurseProps)
        } else {
            arrNurses[nursePosition].hired_now.push(nurse.job_id)
        }
    })

    arrNurses = arrNurses.map((nurse) => {
        var cont = 0;

        res.facilities.forEach((facility) => {
            let jobOportunities = facility.jobs.filter(job => !nurse.hired_now.includes(job.job_id));
            if (jobOportunities.length > 0) {
                jobOportunities.forEach(jobOp => {
                    cont = jobOp.nurse_type === nurse.nurse_type ? cont + 1 : cont;
                });
            }
        });

        return ({
            nurse_id: nurse.nurse_id,
            nurse_name: nurse.nurse_name,
            nurse_type: nurse.nurse_type,
            total_jobs_can_hired: nurse.total_jobs_can_hired + cont
        })

    })
    delete res.facilities;
    res.status(200).json(arrNurses);
})

router.post('/q6query', getCoworkers);

module.exports = router;