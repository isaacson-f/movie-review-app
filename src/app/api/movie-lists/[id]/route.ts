import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sessionOptions } from '@/lib/session'
import { getIronSession } from 'iron-session'

// Helper function to check ownership
async function checkOwnership(listId: number, userId: number) {
    const movieList = await prisma.movieList.findUnique({
        where: { id: listId },
    });
    if (!movieList) return 'not_found';
    if (movieList.userId !== userId) return 'forbidden';
    return 'authorized';
}


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const listId = parseInt(params.id, 10);
    const movieList = await prisma.movieList.findUnique({
        where: { id: listId },
        include: { movies: true },
    });

    if (!movieList) {
        return NextResponse.json({ message: 'Movie list not found' }, { status: 404 });
    }

    return NextResponse.json(movieList);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getIronSession(req, new NextResponse(), sessionOptions);
    const sessionUser = session.user;
    if (!sessionUser) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const listId = parseInt(params.id, 10);
    const ownership = await checkOwnership(listId, sessionUser.id);
    if (ownership === 'not_found') {
        return NextResponse.json({ message: 'Movie list not found' }, { status: 404 });
    }
    if (ownership === 'forbidden') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { name } = await req.json();
    if (!name) {
        return NextResponse.json({ message: 'Missing name field' }, { status: 400 });
    }

    const updatedList = await prisma.movieList.update({
        where: { id: listId },
        data: { name },
    });

    return NextResponse.json(updatedList);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getIronSession(req, new NextResponse(), sessionOptions);
    const sessionUser = session.user;
    if (!sessionUser) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const listId = parseInt(params.id, 10);
    const ownership = await checkOwnership(listId, sessionUser.id);
    if (ownership === 'not_found') {
        return NextResponse.json({ message: 'Movie list not found' }, { status: 404 });
    }
    if (ownership === 'forbidden') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.movieList.delete({
        where: { id: listId },
    });

    return new NextResponse(null, { status: 204 });
}
