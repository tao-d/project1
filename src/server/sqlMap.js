

module.exports={
  user: {
    add: 'insert into user(username, password,date,user_id) values(?, ?, ?, REPLACE(UUID(),"-",""))',
    selectUser: 'select * from user WHERE username = ? AND password = ? ',
    allUser:`select * from user`
  },
  userInformations:{
    add:'insert into user_informations(username,user_message,age,sex,address) values(?, null, null, null,null)',
    selectUserInformations:'select * from user_informations where ?',
    updateUserInformations:`update user_informations set ? where username = ?`
  },
  doctor:{
    allDoctor:'select * from doctor',
    selectDoctor:'select * from doctor where ?'
  },
  doctorTime:{
    selectDoctorTime:'select * from doctor_time where ?',
    countDecrease:`update doctor_time set ? = ?-1 where doctor_name = ?`
  },
  appointment:{
    addAppointment:`insert into appointments(doctor_name,username,time,status) values(?,?,?,?)`,
    selectAppointments:`select appointments.*,doctor.* from appointments,doctor 
    where appointments.doctor_name = doctor.doctor_name and appointments.username = ? and appointments.status = ?`
  }
}