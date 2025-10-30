import React, { Component } from "react";
import {Card } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { } from "@fullcalendar/interaction";
import Alert from "sweetalert2";

class CalendarData extends Component {
   state = {
      calendarEvents: [
		{
            title: "Annual Meeting Envatos Community",
            start: new Date("2021-10-03 12:00"),
            end:  new Date("2021-10-04 12:30"),
            id: "99999110",
        },
		{
            title: "Conference",
            start: new Date("2021-10-11 12:00"),
            end:  new Date("2021-10-12 12:30"),
            id: "99999110",
        },
        {
            title: "Atlanta Monster",
            start: new Date("2021-10-15 00:00"),
            id: "99999997",
        },
		{
            title: "Birthday Party",
            start: new Date("2021-10-17 00:00"),
            id: "99999998",
        },
        {
            title: "My Favorite Murder",
            start: new Date("2021-10-21 00:00"),
            id: "99999999",
        }, 
		{
            title: "Dinner",
            start: new Date("2021-10-29 10:00"),
            end:  new Date("2021-10-30 12:30"),
            id: "99999110",
        },
		{
            title: "Conference",
            start: new Date("2021-11-11 12:00"),
            end:  new Date("2021-11-12 12:30"),
            id: "99999110",
        },
        {
            title: "Atlanta Monster",
            start: new Date("2021-11-15 00:00"),
            id: "99999997",
        },
		{
            title: "Birthday Party",
            start: new Date("2021-11-17 00:00"),
            id: "99999998",
        },
        {
            title: "My Favorite Murder",
            start: new Date("2021-11-21 00:00"),
            id: "99999999",
        }, 
		{
            title: "Dinner",
            start: new Date("2021-11-29 10:00"),
            end:  new Date("2021-11-30 12:30"),
            id: "99999110",
        },
      ],
      events: [
         { title: "Event 1", id: "1" },
         { title: "Event 2", id: "2" },
         { title: "Event 3", id: "3" },
         { title: "Event 4", id: "4" },
         { title: "Event 5", id: "5" },
      ],
   };

   /**
    * adding dragable properties to external events through javascript
    */
	/* componentDidMount() {
      let draggableEl = document.getElementById("external-events");
      new Draggable(draggableEl, {
         itemSelector: ".fc-event",
         eventData: function (eventEl) {
            let title = eventEl.getAttribute("title");
            let id = eventEl.getAttribute("data");
            return {
               title: title,
               id: id,
            };
         },
      });
    } */

   /**
    * when we click on event we are displaying event details
    */
   eventClick = (eventClick) => {
      Alert.fire({
         title: eventClick.event.title,
         html:
            `<div className="table-responsive">
      <table className="table">
      <tbody>
      <tr >
      <td>Title</td>
      <td><strong>` +
            eventClick.event.title +
            `</strong></td>
      </tr>
      <tr >
      <td>Start Time</td>
      <td><strong>
      ` +
            eventClick.event.start +
            `
      </strong></td>
      </tr>
      </tbody>
      </table>
      </div>`,

         showCancelButton: true,
         confirmButtonColor: "#d33",
         cancelButtonColor: "#3085d6",
         confirmButtonText: "Remove Event",
         cancelButtonText: "Close",
      }).then((result) => {
         if (result.value) {
            eventClick.event.remove(); // It will remove event from the calendar
            Alert.fire("Deleted!", "Your Event has been deleted.", "success");
         }
      });
   };

   render() {
      return (
			
            <div className="row">
				<div className="col-xl-12">
					<div className="card dashboard-calendar">
						 <Card.Body>
							<div className="app-fullcalendar" id="calendar">
							   <FullCalendar
								  defaultView="dayGridMonth"
									headerToolbar={{
										start: "prev,next today",
										center: "title",
										end:
											"dayGridMonth,timeGridWeek,timeGridDay",
									}}
								  rerenderDelay={10}
								  eventDurationEditable={false}
								  editable={true}
								  droppable={true}
								  plugins={[
									 dayGridPlugin,
									 timeGridPlugin,
									 interactionPlugin,
								  ]}
								  ref={this.calendarComponentRef}
								  weekends={this.state.calendarWeekends}
								  events={this.state.calendarEvents}
								  eventDrop={this.drop}
								  // drop={this.drop}
								  eventReceive={this.eventReceive}
								  eventClick={this.eventClick}
								  // selectable={true}
							   />
							</div>
						 </Card.Body>
					</div>
               </div>
            </div>
        
      );
   }
}

export default CalendarData;
