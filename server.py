import socket
from struct import *

#UDP_IP = "96.49.100.238"
UDP_IP = "127.0.0.1"
#UDP_IP = socket.gethostbyname("")
print ("Receiver IP: ", UDP_IP)
#UDP_PORT = 6000
UDP_PORT = int(input ("Enter Port "))
print ("Port: ", UDP_PORT)
sock = socket.socket(socket.AF_INET, # Internet
                    socket.SOCK_DGRAM) # UDP
sock.bind((UDP_IP, UDP_PORT))


while True:
    data, addr = sock.recvfrom(1024) # buffer size is 1024 bytes
    #print "received message:", data
    #print "received message: %1.3f %1.3f %1.3f %1.3f", unpack_from ('!f', data, 0), unpack_from ('!f', data, 4), unpack_from ('!f', data, 8), unpack_from ('!f', data, 12)
    print ("received message")
    print ("acc x: %1.4f" %unpack_from ('!f', data, 0))
    print ("acc y: %1.4f" %unpack_from ('!f', data, 4))
    print ("acc z: %1.4f" %unpack_from ('!f', data, 8))
    print ("rot x: %1.4f" %unpack_from ('!f', data, 24))
    print ("rot y: %1.4f" %unpack_from ('!f', data, 28))
    print ("rot z: %1.4f" %unpack_from ('!f', data, 32))