import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, useColorModeValue } from '@chakra-ui/react';
import StudentServices from './Services/StudentServices';
import TeacherServices from './Services/TeacherServices';
import AdministrationServices from './Services/AdministrationServices';

function Services() {
  const colors = useColorModeValue(
    ['red.50', 'teal.50', 'blue.50'],
    ['red.900', 'teal.900', 'blue.900'],
  )
  const [tabIndex, setTabIndex] = useState(0)
  const bg = colors[tabIndex]

  return (
    <Tabs onChange={(index) => setTabIndex(index)} bg={bg}>
      <TabList>
        <Tab>STUDENT SERVICES</Tab>
        <Tab>TEACHER SERVICES</Tab>
        <Tab>ADMINISTRATIVE SERVICES</Tab>
      </TabList>
      <TabPanels p='2rem'>
        <TabPanel>
          <StudentServices />
        </TabPanel>
        <TabPanel>
          <TeacherServices />
        </TabPanel>
        <TabPanel>
          <AdministrationServices />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default Services;