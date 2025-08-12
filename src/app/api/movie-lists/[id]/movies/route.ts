import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sessionOptions } from '@/lib/session'
import { getIronSession } from 'iron-session'

// Using a similar ownership check as before
async function checkOwnership(listId: number, userId: number) {
    const movieList = await prisma.movieList.findUnique({
        where: { id: listId },
    });
    if (!movieList) return 'not_found';
    if (movieList.userId !== userId) return 'forbidden';
    return 'authorized';
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
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

    const { movieId } = await req.json();
    if (!movieId) {
        return NextResponse.json({ message: 'Missing movieId field' }, { status: 400 });
    }

    const updatedList = await prisma.movieList.update({
        where: { id: listId },
        data: {
            movies: {
                connect: { id: movieId },
            },
        },
        include: { movies: true }
    });

    return NextResponse.json(updatedList);
}
