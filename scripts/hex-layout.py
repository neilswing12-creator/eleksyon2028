"""Assigns each province to a hex cell so the cartogram keeps the shape of the archipelago.

Input: JSON list of {id, x, y} projected province centroids.
Output: {"size", "width", "height", "cells": {id: {"q", "r", "x", "y"}}} on stdout.

Pointy-top hexes on an odd-r offset grid. A min-cost assignment (Hungarian algorithm)
between centroids and grid cells keeps every province as close as possible to where it
really is, while giving each province its own equally-sized hex.
"""
import json
import math
import sys

import numpy as np
from scipy.optimize import linear_sum_assignment

SIZE = float(sys.argv[2]) if len(sys.argv) > 2 else 34.0  # hex radius in map units

points = json.load(open(sys.argv[1]))
xs = np.array([p["x"] for p in points], dtype=float)
ys = np.array([p["y"] for p in points], dtype=float)

w = math.sqrt(3) * SIZE  # horizontal spacing
h = 1.5 * SIZE  # vertical spacing

cells = []
r_min, r_max = int(ys.min() // h) - 2, int(ys.max() // h) + 3
q_min, q_max = int(xs.min() // w) - 2, int(xs.max() // w) + 3
for r in range(r_min, r_max):
    for q in range(q_min, q_max):
        cx = q * w + (w / 2 if r % 2 else 0)
        cy = r * h
        cells.append((q, r, cx, cy))

cx = np.array([c[2] for c in cells])
cy = np.array([c[3] for c in cells])
cost = (xs[:, None] - cx[None, :]) ** 2 + (ys[:, None] - cy[None, :]) ** 2
rows, cols = linear_sum_assignment(cost)

assigned = {}
for i, j in zip(rows, cols):
    q, r, x, y = cells[j]
    assigned[points[i]["id"]] = {"q": q, "r": r, "x": round(x, 1), "y": round(y, 1)}

# Normalise to a tight canvas with a margin of one hex.
min_x = min(c["x"] for c in assigned.values()) - w
min_y = min(c["y"] for c in assigned.values()) - SIZE * 1.2
for c in assigned.values():
    c["x"] = round(c["x"] - min_x, 1)
    c["y"] = round(c["y"] - min_y, 1)
width = max(c["x"] for c in assigned.values()) + w
height = max(c["y"] for c in assigned.values()) + SIZE * 1.2

print(json.dumps({"size": SIZE, "width": round(width), "height": round(height), "cells": assigned}))
