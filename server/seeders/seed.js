const sequelize = require('../config/database');
const { setupAssociations, Admin, Department, Employee, SalaryStructure, Deduction, Attendance, Payroll } = require('../models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    setupAssociations();
    await sequelize.sync({ force: true });
    console.log('Database reset and synced.');

    // Create admin
    const adminHash = await bcrypt.hash('admin123', 10);
    await Admin.create({ username: 'admin', password: adminHash, fullName: 'Arun Kapoor' });
    console.log('Admin created: admin / admin123');

    // Default employee password
    const empHash = await bcrypt.hash('employee123', 10);

    // Create 8 departments
    const departments = await Department.bulkCreate([
      { name: 'Engineering', description: 'Software development and technical operations' },
      { name: 'Human Resources', description: 'Employee relations, hiring, and workforce management' },
      { name: 'Finance', description: 'Accounting, budgets, and financial planning' },
      { name: 'Marketing', description: 'Brand strategy, digital campaigns, and communications' },
      { name: 'Operations', description: 'Logistics, process optimization, and administration' },
      { name: 'Sales', description: 'Client acquisition, revenue generation, and partnerships' },
      { name: 'Product', description: 'Product management, roadmaps, and user research' },
      { name: 'Legal & Compliance', description: 'Regulatory affairs, contracts, and corporate governance' },
    ]);
    console.log(`${departments.length} departments created.`);

    // 50 employees with Indian names — all have password "employee123"
    const employeeData = [
      // Engineering (dept 1) - 10
      { name: 'Rajesh Kumar', email: 'rajesh.kumar@payrollsys.in', phone: '+91 98765 43210', password: empHash, departmentId: 1, joinDate: '2022-03-15' },
      { name: 'Priya Sharma', email: 'priya.sharma@payrollsys.in', phone: '+91 87654 32109', password: empHash, departmentId: 1, joinDate: '2022-06-01' },
      { name: 'Ananya Gupta', email: 'ananya.gupta@payrollsys.in', phone: '+91 93456 78901', password: empHash, departmentId: 1, joinDate: '2023-04-05' },
      { name: 'Neha Deshmukh', email: 'neha.deshmukh@payrollsys.in', phone: '+91 77890 12345', password: empHash, departmentId: 1, joinDate: '2023-06-14' },
      { name: 'Rohit Bansal', email: 'rohit.bansal@payrollsys.in', phone: '+91 90123 45678', password: empHash, departmentId: 1, joinDate: '2021-08-22' },
      { name: 'Kavita Menon', email: 'kavita.menon@payrollsys.in', phone: '+91 81234 56789', password: empHash, departmentId: 1, joinDate: '2023-09-10' },
      { name: 'Siddharth Rao', email: 'siddharth.rao@payrollsys.in', phone: '+91 72345 67890', password: empHash, departmentId: 1, joinDate: '2022-01-18' },
      { name: 'Meera Iyer', email: 'meera.iyer@payrollsys.in', phone: '+91 63456 78901', password: empHash, departmentId: 1, joinDate: '2024-01-08' },
      { name: 'Aditya Kulkarni', email: 'aditya.kulkarni@payrollsys.in', phone: '+91 94567 89012', password: empHash, departmentId: 1, joinDate: '2023-11-20' },
      { name: 'Divya Pillai', email: 'divya.pillai@payrollsys.in', phone: '+91 85678 90123', password: empHash, departmentId: 1, joinDate: '2022-07-25' },

      // Human Resources (dept 2) - 6
      { name: 'Sneha Reddy', email: 'sneha.reddy@payrollsys.in', phone: '+91 65432 10987', password: empHash, departmentId: 2, joinDate: '2023-01-10' },
      { name: 'Arjun Mehta', email: 'arjun.mehta@payrollsys.in', phone: '+91 60123 45678', password: empHash, departmentId: 2, joinDate: '2023-02-18' },
      { name: 'Lakshmi Narayan', email: 'lakshmi.narayan@payrollsys.in', phone: '+91 91234 56700', password: empHash, departmentId: 2, joinDate: '2021-05-15' },
      { name: 'Ravi Shankar', email: 'ravi.shankar@payrollsys.in', phone: '+91 82345 67801', password: empHash, departmentId: 2, joinDate: '2022-11-10' },
      { name: 'Geeta Bhatia', email: 'geeta.bhatia@payrollsys.in', phone: '+91 73456 78902', password: empHash, departmentId: 2, joinDate: '2024-02-01' },
      { name: 'Nikhil Saxena', email: 'nikhil.saxena@payrollsys.in', phone: '+91 64567 89013', password: empHash, departmentId: 2, joinDate: '2023-07-22' },

      // Finance (dept 3) - 7
      { name: 'Amit Patel', email: 'amit.patel@payrollsys.in', phone: '+91 76543 21098', password: empHash, departmentId: 3, joinDate: '2021-11-20' },
      { name: 'Deepika Joshi', email: 'deepika.joshi@payrollsys.in', phone: '+91 71234 56789', password: empHash, departmentId: 3, joinDate: '2022-12-01' },
      { name: 'Manoj Tiwari', email: 'manoj.tiwari@payrollsys.in', phone: '+91 92345 67802', password: empHash, departmentId: 3, joinDate: '2021-03-14' },
      { name: 'Swati Agarwal', email: 'swati.agarwal@payrollsys.in', phone: '+91 83456 78903', password: empHash, departmentId: 3, joinDate: '2022-05-28' },
      { name: 'Pranav Choudhary', email: 'pranav.choudhary@payrollsys.in', phone: '+91 74567 89014', password: empHash, departmentId: 3, joinDate: '2023-08-05' },
      { name: 'Rekha Sinha', email: 'rekha.sinha@payrollsys.in', phone: '+91 65678 90125', password: empHash, departmentId: 3, joinDate: '2024-01-15' },
      { name: 'Ashok Mishra', email: 'ashok.mishra@payrollsys.in', phone: '+91 96789 01236', password: empHash, departmentId: 3, joinDate: '2022-09-12' },

      // Marketing (dept 4) - 6
      { name: 'Vikram Singh', email: 'vikram.singh@payrollsys.in', phone: '+91 54321 09876', password: empHash, departmentId: 4, joinDate: '2022-08-25' },
      { name: 'Pooja Verma', email: 'pooja.verma@payrollsys.in', phone: '+91 99012 34567', password: empHash, departmentId: 4, joinDate: '2022-10-08' },
      { name: 'Tanvi Kapoor', email: 'tanvi.kapoor@payrollsys.in', phone: '+91 80123 45679', password: empHash, departmentId: 4, joinDate: '2023-03-20' },
      { name: 'Sameer Malhotra', email: 'sameer.malhotra@payrollsys.in', phone: '+91 71234 56780', password: empHash, departmentId: 4, joinDate: '2021-12-01' },
      { name: 'Ishita Ghosh', email: 'ishita.ghosh@payrollsys.in', phone: '+91 62345 67891', password: empHash, departmentId: 4, joinDate: '2023-05-14' },
      { name: 'Kunal Dhawan', email: 'kunal.dhawan@payrollsys.in', phone: '+91 93456 78902', password: empHash, departmentId: 4, joinDate: '2024-03-01' },

      // Operations (dept 5) - 6
      { name: 'Karthik Nair', email: 'karthik.nair@payrollsys.in', phone: '+91 82345 67890', password: empHash, departmentId: 5, joinDate: '2021-07-12' },
      { name: 'Suresh Iyer', email: 'suresh.iyer@payrollsys.in', phone: '+91 88901 23456', password: empHash, departmentId: 5, joinDate: '2021-09-30' },
      { name: 'Parveen Kaur', email: 'parveen.kaur@payrollsys.in', phone: '+91 79012 34568', password: empHash, departmentId: 5, joinDate: '2022-04-18' },
      { name: 'Dinesh Prasad', email: 'dinesh.prasad@payrollsys.in', phone: '+91 60123 45679', password: empHash, departmentId: 5, joinDate: '2023-01-25' },
      { name: 'Sunita Yadav', email: 'sunita.yadav@payrollsys.in', phone: '+91 91234 56701', password: empHash, departmentId: 5, joinDate: '2022-06-10' },
      { name: 'Ajay Thakur', email: 'ajay.thakur@payrollsys.in', phone: '+91 82345 67802', password: empHash, departmentId: 5, joinDate: '2024-01-22' },

      // Sales (dept 6) - 6
      { name: 'Nisha Pandey', email: 'nisha.pandey@payrollsys.in', phone: '+91 73456 78903', password: empHash, departmentId: 6, joinDate: '2022-02-10' },
      { name: 'Vivek Chauhan', email: 'vivek.chauhan@payrollsys.in', phone: '+91 64567 89014', password: empHash, departmentId: 6, joinDate: '2021-10-05' },
      { name: 'Aarti Jain', email: 'aarti.jain@payrollsys.in', phone: '+91 95678 90125', password: empHash, departmentId: 6, joinDate: '2023-06-20' },
      { name: 'Manish Dubey', email: 'manish.dubey@payrollsys.in', phone: '+91 86789 01236', password: empHash, departmentId: 6, joinDate: '2022-08-14' },
      { name: 'Shruti Bhatt', email: 'shruti.bhatt@payrollsys.in', phone: '+91 77890 12347', password: empHash, departmentId: 6, joinDate: '2023-12-01' },
      { name: 'Gaurav Sethi', email: 'gaurav.sethi@payrollsys.in', phone: '+91 68901 23458', password: empHash, departmentId: 6, joinDate: '2024-02-18' },

      // Product (dept 7) - 5
      { name: 'Pallavi Deshpande', email: 'pallavi.deshpande@payrollsys.in', phone: '+91 90012 34569', password: empHash, departmentId: 7, joinDate: '2022-03-08' },
      { name: 'Harsh Vardhan', email: 'harsh.vardhan@payrollsys.in', phone: '+91 81123 45670', password: empHash, departmentId: 7, joinDate: '2021-11-14' },
      { name: 'Ritika Srivastava', email: 'ritika.srivastava@payrollsys.in', phone: '+91 72234 56781', password: empHash, departmentId: 7, joinDate: '2023-04-28' },
      { name: 'Omkar Patil', email: 'omkar.patil@payrollsys.in', phone: '+91 63345 67892', password: empHash, departmentId: 7, joinDate: '2022-10-20' },
      { name: 'Sonal Chopra', email: 'sonal.chopra@payrollsys.in', phone: '+91 94456 78903', password: empHash, departmentId: 7, joinDate: '2024-01-05' },

      // Legal & Compliance (dept 8) - 4
      { name: 'Raghav Khanna', email: 'raghav.khanna@payrollsys.in', phone: '+91 85567 89014', password: empHash, departmentId: 8, joinDate: '2021-06-18' },
      { name: 'Anjali Mukherjee', email: 'anjali.mukherjee@payrollsys.in', phone: '+91 76678 90125', password: empHash, departmentId: 8, joinDate: '2022-09-05' },
      { name: 'Tarun Oberoi', email: 'tarun.oberoi@payrollsys.in', phone: '+91 67789 01236', password: empHash, departmentId: 8, joinDate: '2023-02-14' },
      { name: 'Madhuri Hegde', email: 'madhuri.hegde@payrollsys.in', phone: '+91 98890 12347', password: empHash, departmentId: 8, joinDate: '2023-10-01' },
    ];

    const employees = await Employee.bulkCreate(employeeData);
    console.log(`${employees.length} employees created (password: employee123).`);

    // Salary structures (INR)
    const salaryMap = [
      { employeeId: 1,  basic: 55000, hra: 22000, bonus: 6000 },
      { employeeId: 2,  basic: 48000, hra: 19200, bonus: 5000 },
      { employeeId: 3,  basic: 35000, hra: 14000, bonus: 3500 },
      { employeeId: 4,  basic: 30000, hra: 12000, bonus: 2500 },
      { employeeId: 5,  basic: 62000, hra: 24800, bonus: 7500 },
      { employeeId: 6,  basic: 28000, hra: 11200, bonus: 2000 },
      { employeeId: 7,  basic: 52000, hra: 20800, bonus: 6000 },
      { employeeId: 8,  basic: 26000, hra: 10400, bonus: 2000 },
      { employeeId: 9,  basic: 32000, hra: 12800, bonus: 3000 },
      { employeeId: 10, basic: 44000, hra: 17600, bonus: 4500 },
      { employeeId: 11, basic: 38000, hra: 15200, bonus: 4000 },
      { employeeId: 12, basic: 30000, hra: 12000, bonus: 3000 },
      { employeeId: 13, basic: 45000, hra: 18000, bonus: 5000 },
      { employeeId: 14, basic: 33000, hra: 13200, bonus: 3000 },
      { employeeId: 15, basic: 26000, hra: 10400, bonus: 2000 },
      { employeeId: 16, basic: 35000, hra: 14000, bonus: 3500 },
      { employeeId: 17, basic: 58000, hra: 23200, bonus: 7000 },
      { employeeId: 18, basic: 40000, hra: 16000, bonus: 4000 },
      { employeeId: 19, basic: 65000, hra: 26000, bonus: 8000 },
      { employeeId: 20, basic: 36000, hra: 14400, bonus: 3500 },
      { employeeId: 21, basic: 32000, hra: 12800, bonus: 3000 },
      { employeeId: 22, basic: 28000, hra: 11200, bonus: 2500 },
      { employeeId: 23, basic: 42000, hra: 16800, bonus: 4500 },
      { employeeId: 24, basic: 42000, hra: 16800, bonus: 4500 },
      { employeeId: 25, basic: 39000, hra: 15600, bonus: 4000 },
      { employeeId: 26, basic: 34000, hra: 13600, bonus: 3000 },
      { employeeId: 27, basic: 48000, hra: 19200, bonus: 5500 },
      { employeeId: 28, basic: 30000, hra: 12000, bonus: 2500 },
      { employeeId: 29, basic: 27000, hra: 10800, bonus: 2000 },
      { employeeId: 30, basic: 46000, hra: 18400, bonus: 5000 },
      { employeeId: 31, basic: 50000, hra: 20000, bonus: 6000 },
      { employeeId: 32, basic: 33000, hra: 13200, bonus: 3000 },
      { employeeId: 33, basic: 29000, hra: 11600, bonus: 2500 },
      { employeeId: 34, basic: 35000, hra: 14000, bonus: 3500 },
      { employeeId: 35, basic: 27000, hra: 10800, bonus: 2000 },
      { employeeId: 36, basic: 38000, hra: 15200, bonus: 8000 },
      { employeeId: 37, basic: 45000, hra: 18000, bonus: 10000 },
      { employeeId: 38, basic: 30000, hra: 12000, bonus: 5000 },
      { employeeId: 39, basic: 34000, hra: 13600, bonus: 6000 },
      { employeeId: 40, basic: 28000, hra: 11200, bonus: 4000 },
      { employeeId: 41, basic: 26000, hra: 10400, bonus: 3500 },
      { employeeId: 42, basic: 52000, hra: 20800, bonus: 6000 },
      { employeeId: 43, basic: 58000, hra: 23200, bonus: 7000 },
      { employeeId: 44, basic: 36000, hra: 14400, bonus: 3500 },
      { employeeId: 45, basic: 40000, hra: 16000, bonus: 4000 },
      { employeeId: 46, basic: 30000, hra: 12000, bonus: 3000 },
      { employeeId: 47, basic: 55000, hra: 22000, bonus: 6000 },
      { employeeId: 48, basic: 42000, hra: 16800, bonus: 4500 },
      { employeeId: 49, basic: 35000, hra: 14000, bonus: 3500 },
      { employeeId: 50, basic: 32000, hra: 12800, bonus: 3000 },
    ];
    await SalaryStructure.bulkCreate(salaryMap);
    console.log('50 salary structures created.');

    // Deductions (PF=12% of basic, TDS ~5%, professional tax by slab)
    const deductionMap = salaryMap.map((s) => {
      const pf = Math.round(s.basic * 0.12);
      const tax = Math.round((s.basic + s.hra + s.bonus) * 0.05);
      const other = s.basic >= 50000 ? 750 : s.basic >= 35000 ? 500 : 300;
      return { employeeId: s.employeeId, tax, pf, other };
    });
    await Deduction.bulkCreate(deductionMap);
    console.log('50 deduction records created.');

    // ================================================================
    // Generate 24 months of attendance + payroll for all 50 employees
    // ================================================================
    const now = new Date();
    const monthsToGenerate = [];
    for (let i = 1; i <= 24; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthsToGenerate.push({ month: d.getMonth() + 1, year: d.getFullYear() });
    }
    console.log(`Generating data for ${monthsToGenerate.length} months...`);

    // Working days per month (realistic variation)
    const workingDaysPerMonth = { 1: 22, 2: 20, 3: 22, 4: 21, 5: 22, 6: 21, 7: 23, 8: 22, 9: 21, 10: 22, 11: 21, 12: 20 };

    // Build all attendance records
    const allAttendance = [];
    for (const emp of employees) {
      const empJoinDate = new Date(emp.joinDate);
      for (const { month, year } of monthsToGenerate) {
        // Skip months before the employee joined
        const monthStart = new Date(year, month - 1, 1);
        if (monthStart < new Date(empJoinDate.getFullYear(), empJoinDate.getMonth(), 1)) continue;

        const workingDays = workingDaysPerMonth[month] || 22;
        // Random absences: 0-3 days, occasionally up to 5
        const maxAbsent = Math.random() < 0.1 ? 5 : 3;
        const absent = Math.floor(Math.random() * (maxAbsent + 1));
        const presentDays = workingDays - absent;

        allAttendance.push({
          employeeId: emp.id, month, year, workingDays, presentDays,
        });
      }
    }
    // Bulk insert attendance in chunks to avoid memory issues
    const CHUNK = 200;
    for (let i = 0; i < allAttendance.length; i += CHUNK) {
      await Attendance.bulkCreate(allAttendance.slice(i, i + CHUNK));
    }
    console.log(`${allAttendance.length} attendance records created.`);

    // Build payroll records from attendance + salary + deductions
    // Create lookup maps for fast access
    const salaryLookup = {};
    salaryMap.forEach((s) => { salaryLookup[s.employeeId] = s; });
    const deductionLookup = {};
    deductionMap.forEach((d) => { deductionLookup[d.employeeId] = d; });

    const allPayroll = [];
    for (const att of allAttendance) {
      const sal = salaryLookup[att.employeeId];
      const ded = deductionLookup[att.employeeId];
      if (!sal) continue;

      const factor = att.workingDays > 0 ? att.presentDays / att.workingDays : 1;
      const basicAdj = Math.round(sal.basic * factor * 100) / 100;
      const hraAdj = Math.round(sal.hra * factor * 100) / 100;
      const bonusAdj = Math.round(sal.bonus * factor * 100) / 100;
      const grossSalary = Math.round((basicAdj + hraAdj + bonusAdj) * 100) / 100;

      const tax = ded ? ded.tax : 0;
      const pf = ded ? ded.pf : 0;
      const otherDed = ded ? ded.other : 0;
      const totalDeduction = Math.round((tax + pf + otherDed) * 100) / 100;
      const netSalary = Math.round((grossSalary - totalDeduction) * 100) / 100;

      allPayroll.push({
        employeeId: att.employeeId,
        month: att.month,
        year: att.year,
        basic: basicAdj,
        hra: hraAdj,
        bonus: bonusAdj,
        grossSalary,
        tax,
        pf,
        otherDeductions: otherDed,
        totalDeduction,
        netSalary,
        workingDays: att.workingDays,
        presentDays: att.presentDays,
      });
    }
    for (let i = 0; i < allPayroll.length; i += CHUNK) {
      await Payroll.bulkCreate(allPayroll.slice(i, i + CHUNK));
    }
    console.log(`${allPayroll.length} payroll records created.`);

    // Summary
    const totalPaid = allPayroll.reduce((s, p) => s + p.netSalary, 0);
    console.log(`\n✅ Database seeded successfully!`);
    console.log(`   50 employees × ${monthsToGenerate.length} months = ~${allPayroll.length} payroll records`);
    console.log(`   Total salary paid: ₹${totalPaid.toLocaleString('en-IN')}`);
    console.log(`\n   Admin login:    admin / admin123`);
    console.log(`   Employee login: <email> / employee123`);
    console.log(`   Example:        rajesh.kumar@payrollsys.in / employee123`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
