import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db'; // Adjust the path as necessary

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const sql = 'SELECT * FROM jobseekers WHERE id = ?';
    const results = await query(sql, [params.id]);

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: 'Jobseeker not found' }, { status: 404 });
    }

    return NextResponse.json(results[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobseeker' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { fullName, email, phone, skills, location, experienceYears } = body;

    if (!fullName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sql = `
      UPDATE jobseekers 
      SET fullName = ?, email = ?, phone = ?, skills = ?, location = ?, experienceYears = ?
      WHERE id = ?
    `;
    const sqlParams = [
      fullName,
      email,
      phone || null,
      skills || null,
      location || null,
      experienceYears || 0,
      params.id,
    ];

    const result: any = await query(sql, sqlParams);

    // Check for affectedRows in result or result[0] depending on the query implementation
    const affectedRows =
      typeof result.affectedRows === 'number'
        ? result.affectedRows
        : Array.isArray(result) && result[0] && typeof result[0].affectedRows === 'number'
        ? result[0].affectedRows
        : 0;

    if (affectedRows === 0) {
      return NextResponse.json({ error: 'Jobseeker not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Jobseeker updated' });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update jobseeker' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const sql = 'DELETE FROM jobseekers WHERE id = ?';
    const result: any = await query(sql, [params.id]);

    const affectedRows =
      typeof result.affectedRows === 'number'
        ? result.affectedRows
        : Array.isArray(result) && result[0] && typeof result[0].affectedRows === 'number'
        ? result[0].affectedRows
        : 0;

    if (affectedRows === 0) {
      return NextResponse.json({ error: 'Jobseeker not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Jobseeker deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete jobseeker' }, { status: 500 });
  }
}