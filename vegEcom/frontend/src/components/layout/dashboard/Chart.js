import React, {useState, useEffect} from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}



export default function Chart() {
  const theme = useTheme();

  const [data,setData] = useState([]);

  useEffect(()=>{
    fetch('/api/w/getGraphData',{
      method:'GET',
      headers:{
        "Authorization":`Token ${localStorage.getItem('AdminToken')}`
      }
    })
    .then(response => response.json())
    .then(graphData => {
      var newDataList = []
      graphData.map(item => {
        newDataList.push(createData(
          item.created_at,item.total
        ))
      })
      
      setData(newDataList)
    })
  },[])

  return (
    <React.Fragment>
      <Title>Today</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Sales ($)
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}