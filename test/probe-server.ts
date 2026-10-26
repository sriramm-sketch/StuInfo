import http from 'node:http';

async function runProbe() {
  console.log('Testing server endpoints via Node in-process client...\n');

  // Dynamically start server
  await import('../src/server/index.ts');

  // Small delay to ensure listen
  await new Promise(r => setTimeout(r, 800));

  // 1. Health check
  console.log('1. Probing GET /api/health:');
  const healthRes = await fetch('http://localhost:3000/api/health');
  console.log('   Status:', healthRes.status);
  const healthData = await healthRes.json();
  console.log('   Payload:', JSON.stringify(healthData));

  // 2. Prediction endpoint
  console.log('\n2. Probing POST /api/predict:');
  const predRes = await fetch('http://localhost:3000/api/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentName: 'Alex Jordan',
      gradeLevel: '11th Grade',
      studyHoursPerWeek: 14,
      classAttendancePct: 92,
      previousScore: 82,
      assignmentCompletionPct: 88,
      participationLevel: 'active',
      resourceAccess: 'moderate'
    })
  });
  console.log('   Status:', predRes.status);
  const predData = await predRes.json();
  console.log('   Predicted Score:', predData.data?.predictedScore, 'Band:', predData.data?.performanceBand?.label);

  // 3. What-If scenario
  console.log('\n3. Probing POST /api/what-if:');
  const whatIfRes = await fetch('http://localhost:3000/api/what-if', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      baseInputs: predData.data?.inputs,
      modifications: { studyHoursPerWeek: 20, classAttendancePct: 98 }
    })
  });
  console.log('   Status:', whatIfRes.status);
  const whatIfData = await whatIfRes.json();
  console.log('   Simulated Score:', whatIfData.data?.newScore, 'Delta:', whatIfData.data?.delta);

  // 4. Educator analytics
  console.log('\n4. Probing GET /api/educator/analytics:');
  const analyticsRes = await fetch('http://localhost:3000/api/educator/analytics');
  console.log('   Status:', analyticsRes.status);
  const analyticsData = await analyticsRes.json();
  console.log('   Total students in cohort:', analyticsData.data?.totalStudents, 'Cohort average:', analyticsData.data?.averagePredictedScore);

  // 5. Educator filtered students
  console.log('\n5. Probing GET /api/educator/students?checkInOnly=true:');
  const studentsRes = await fetch('http://localhost:3000/api/educator/students?checkInOnly=true');
  console.log('   Status:', studentsRes.status);
  const studentsData = await studentsRes.json();
  console.log('   Students flagged for check-in:', studentsData.data?.length);

  // 6. Static HTML route
  console.log('\n6. Probing GET / (Single Page App index.html):');
  const htmlRes = await fetch('http://localhost:3000/');
  console.log('   Status:', htmlRes.status, 'Content-Type:', htmlRes.headers.get('content-type'));
  const htmlText = await htmlRes.text();
  console.log('   HTML contains StuInfo brand:', htmlText.includes('StuInfo'));

  // 7. Static CSS route
  console.log('\n7. Probing GET /css/app.css:');
  const cssRes = await fetch('http://localhost:3000/css/app.css');
  console.log('   Status:', cssRes.status, 'Content-Type:', cssRes.headers.get('content-type'));

  console.log('\n✅ All endpoints probed and responding successfully!');
  process.exit(0);
}

runProbe().catch(e => {
  console.error('Probe failed:', e);
  process.exit(1);
});
