SOURCE_FILE = Board.c Gomoku.c AI.c
OBJECT_FILE = Board.o Gomoku.o AI.o

default:
	gcc $(SOURCE_FILE) -g -O4 -c 
	gcc $(OBJECT_FILE) -g -O4 -o ./a.out

compile:
	gcc $(SOURCE_FILE) -g -c 

link:
	gcc $(OBJECT_FILE) -g -o ./a.out

clean: 
	rm -rf ./*.o ./a.out

