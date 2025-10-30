import React,{Fragment} from 'react';
import CalendarData from './Calendar/CalendarData';

const DashboardCalendar = () =>{
	return(
		<Fragment>
			{/* <div id="calendar" class="app-fullcalendar dashboard-calendar">
			</div> */}				
			<CalendarData />
		</Fragment>
	)
}
export default DashboardCalendar;