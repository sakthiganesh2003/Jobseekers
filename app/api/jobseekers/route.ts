import { NextResponse } from 'next/server';
import { query } from '../../../lib/db'; // Adjust the path as necessary


export async function GET(request: Request) {
  console.log('GET /api/jobseekers called'); // Add for debugging
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const skill = searchParams.get('skill');
  const location = searchParams.get('location');
  const minExp = searchParams.get('minExp');
  const maxExp = searchParams.get('maxExp');

  let sql = 'SELECT * FROM jobseekers WHERE 1=1';
  const params: any[] = [];

  if (name) {
    sql += ' AND fullName LIKE ?';
    params.push(`%${name}%`);
  }
  if (skill) {
    sql += ' AND skills LIKE ?';
    params.push(`%${skill}%`);
  }
  if (location) {
    sql += ' AND location = ?';
    params.push(location);
  }
  if (minExp) {
    sql += ' AND experienceYears >= ?';
    params.push(minExp);
  }
  if (maxExp) {
    sql += ' AND experienceYears <= ?';
    params.push(maxExp);
  }

  try {
    const results = await query(sql, params);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobseekers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  console.log('POST /api/jobseekers called'); // Add for debugging
  try {
    const body = await request.json();
    const { fullName, email, phone, skills, location, experienceYears } = body;

    if (!fullName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sql = `
      INSERT INTO jobseekers (fullName, email, phone, skills, location, experienceYears)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [fullName, email, phone || null, skills || null, location || null, experienceYears || 0];

    await query(sql, params);
    return NextResponse.json({ message: 'Jobseeker created' }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create jobseeker' }, { status: 500 });
  }
}