import { Component, OnInit } from '@angular/core';
declare let google: any;
declare let $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  scriptLoaded = false;

  title = 'vtcm';
  // chartType = 'ColumnChart';
  dataTable1 = [['Year', 'Stop', 'Reverse', 'Queue', 'Pedestrian', 'Worng Side', 'Traffic Jam'],
  ['2014', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['2015', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['2016', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['2017', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['2018', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['2019', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()]
  ];
  options1 = {
    'title': 'Number of Incidents Per Year', hAxis: {
      title: 'Year',
    },
    vAxis: {
      title: 'No Of Incidents by Category',

    }, 'legend': 'top', 'isStacked': true
  };

  dataTable2 = [['Month', 'Stop', 'Reverse', 'Queue', 'Pedestrian', 'Worng Side', 'Traffic Jam'],
  ['Jan', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Feb', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Mar', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Apr', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['May', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Jun', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Jul', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Aug', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Sep', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Oct', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Nov', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Dec', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ];
  options2 = {
    'title': 'Number of Incidents in 2016', hAxis: {
      title: 'No Of Incidents by Category',
    },
    vAxis: {
      title: ' Month',
      minValue: 0,

    }, 'legend': 'top', 'isStacked': true
  };

  dataTable3 = [['Week', 'Stop', 'Reverse', 'Queue', 'Pedestrian', 'Worng Side', 'Traffic Jam'],
  ['Week1', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Week2', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Week3', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Week4', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()]
  ];
  options3 = {
    'title': 'Number of Incidents in Jan 2016', hAxis: {
      title: 'weekly',
    },
    vAxis: {
      title: 'No Of Incidents by Category',
      minValue: 0,

    }, 'legend': 'top', 'isStacked': true
  };

  dataTable4 = [['Day', 'Stop', 'Reverse', 'Queue', 'Pedestrian', 'Worng Side', 'Traffic Jam'],
  ['Mon', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Tue', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Wed', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Thu', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Fri', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Sat', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['Sun', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ];
  options4 = {
    'title': 'Number of Incidents in Jan 2016 1st week', hAxis: {
      title: 'week',
    },
    vAxis: {
      title: 'No Of Incidents by Category',
      minValue: 0,

    }, 'legend': 'top', 'isStacked': true
  };

  dataTable5 = [['Hour', 'Stop', 'Reverse', 'Queue', 'Pedestrian', 'Worng Side', 'Traffic Jam'],
  ['1', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['2', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['3', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['4', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['5', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['6', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['7', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['8', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['9', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['10', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['11', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['12', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['13', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['14', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['15', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['16', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['17', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['18', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['19', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['20', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['21', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['22', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['23', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
  ['24', this.random(), this.random(), this.random(), this.random(), this.random(), this.random()]
  ];
  options5 = {
    'title': 'Number of Incidents in Monday 21 Jan 2016', hAxis: {
      title: 'hour',
    },
    vAxis: {
      title: 'No Of Incidents by Category',
      minValue: 0,

    }, 'legend': 'top', 'isStacked': true
  };



  constructor() {

  }
  onLogout() {

  }

  random() {
    return Math.floor(Math.random() * 1000);
  }

  ngOnInit() {
    $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
    });

    if (typeof google === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      document.getElementsByTagName('head')[0].appendChild(script);
      script.addEventListener('load', () => {
        this.scriptLoaded = true;
      });
    }
  }


}
